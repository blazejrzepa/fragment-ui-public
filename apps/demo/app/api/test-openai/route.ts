import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Test endpoint to check if OpenAI API is configured and working
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        status: "error",
        message: "OPENAI_API_KEY is not configured",
        hasKey: false,
      }, { status: 503 });
    }

    // Try to initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Make a simple test call
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "user", content: "Say 'API is working' if you can read this." }
        ],
        max_tokens: 10,
      });

      const response = completion.choices[0].message.content || "";

      return NextResponse.json({
        status: "success",
        message: "OpenAI API is working",
        hasKey: true,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        testResponse: response,
        keyLength: apiKey.length,
        keyPrefix: apiKey.substring(0, 7) + "...",
      });
    } catch (apiError: any) {
      return NextResponse.json({
        status: "error",
        message: "OpenAI API call failed",
        hasKey: true,
        error: apiError.message,
        errorType: apiError.constructor.name,
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Test endpoint error",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

