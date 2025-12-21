/**
 * Variants API
 * 
 * POST /api/variants - Generate UI-DSL variants from uploaded document
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { parsePromptToUIDSL } from "@fragment_ui/ui-dsl";
import { generateCodeFromUIDSL } from "@fragment_ui/ui-dsl";
import { extractTextFromFile, extractSections, chunkText } from "@/lib/docs/ingest";
import { generateVariantPrompt } from "../../variants/prompt";
import type { Variant } from "../../variants/types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const variantCount = parseInt(formData.get("variantCount") as string || "3", 10);
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }
    
    // Extract text from file
    const text = await extractTextFromFile(file);
    const sections = extractSections(text);
    sections.fullText = text;
    
    // Generate prompt for variants
    const prompt = generateVariantPrompt(sections, variantCount);
    
    // Call OpenAI to generate variants
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a UI-DSL generator. Generate valid UI-DSL JSON variants based on document requirements. Always return valid JSON arrays.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8, // Higher temperature for more variety
      response_format: { type: "json_object" },
    });
    
    const responseText = completion.choices[0]?.message?.content || "{}";
    let variantsData: Array<{
      dsl: any;
      description: string;
      sourceSections: string[];
    }>;
    
    try {
      const parsed = JSON.parse(responseText);
      // Handle both { variants: [...] } and direct array
      variantsData = Array.isArray(parsed) ? parsed : parsed.variants || [];
    } catch (error) {
      // If JSON parsing fails, try to extract JSON from text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        variantsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse variants from response");
      }
    }
    
    // Generate TSX for each variant
    const variants: Variant[] = [];
    for (const variantData of variantsData.slice(0, variantCount)) {
      try {
        const tsx = await generateCodeFromUIDSL(variantData.dsl);
        variants.push({
          dsl: variantData.dsl,
          tsx,
          description: variantData.description || "No description provided",
          sourceSections: variantData.sourceSections || [],
        });
      } catch (error: any) {
        console.error(`[Variants API] Error generating TSX for variant:`, error);
        // Continue with other variants even if one fails
      }
    }
    
    if (variants.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any variants" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ variants });
  } catch (error: any) {
    console.error("[Variants API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

