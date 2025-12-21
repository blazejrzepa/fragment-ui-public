import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";

/**
 * API endpoint to bundle CSS for Sandpack
 * 
 * Returns the compiled CSS from @fragment_ui/ui and @fragment_ui/tokens
 */
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const appDir = process.cwd();
    
    // Read tokens CSS
    const tokensCssPath = path.resolve(appDir, "../../packages/tokens/dist/tokens.css");
    let tokensCss = "";
    if (fs.existsSync(tokensCssPath)) {
      tokensCss = fs.readFileSync(tokensCssPath, "utf-8");
    }
    
    // Read UI styles CSS
    const uiStylesPath = path.resolve(appDir, "../../packages/ui/src/styles.css");
    let uiStyles = "";
    if (fs.existsSync(uiStylesPath)) {
      uiStyles = fs.readFileSync(uiStylesPath, "utf-8");
      // Replace @import with actual content
      uiStyles = uiStyles.replace(
        /@import\s+["']@fragment\/tokens\/dist\/tokens\.css["'];?/g,
        tokensCss
      );
      // Remove Tailwind directives - we'll use compiled Tailwind CSS
      uiStyles = uiStyles.replace(/@tailwind\s+\w+;?\n?/g, "");
    }
    
    // Try to read compiled Tailwind CSS from Next.js build
    // This is critical - it contains all the Tailwind classes used by components
    const compiledCssPath = path.resolve(appDir, ".next/static/css/app/layout.css");
    let compiledTailwind = "";
    if (fs.existsSync(compiledCssPath)) {
      compiledTailwind = fs.readFileSync(compiledCssPath, "utf-8");
      console.log(`[bundle-css] Loaded compiled Tailwind CSS: ${compiledTailwind.length} bytes`);
    } else {
      console.warn(`[bundle-css] Compiled Tailwind CSS not found at: ${compiledCssPath}`);
      console.warn(`[bundle-css] This may cause components to render without proper styling!`);
      console.warn(`[bundle-css] Make sure to run 'pnpm build' in apps/demo first.`);
    }
    
    // Read react-day-picker CSS from node_modules
    // This is loaded globally via <link> tag, not as ESM import
    const reactDayPickerCssPath = path.resolve(appDir, "../../node_modules/react-day-picker/dist/style.css");
    let reactDayPickerCss = "";
    if (fs.existsSync(reactDayPickerCssPath)) {
      reactDayPickerCss = fs.readFileSync(reactDayPickerCssPath, "utf-8");
    }
    
    // Combine CSS: tokens + UI styles + react-day-picker + compiled Tailwind (if available)
    // If compiled Tailwind is not available, we'll rely on Tailwind CDN in Sandpack
    const combinedCss = compiledTailwind 
      ? `${tokensCss}\n\n${compiledTailwind}\n\n${uiStyles}\n\n${reactDayPickerCss}`
      : `${tokensCss}\n\n${uiStyles}\n\n${reactDayPickerCss}`;
    
    // Return the CSS with appropriate headers
    return new NextResponse(combinedCss, {
      status: 200,
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("CSS bundle error:", error);
    return NextResponse.json(
      { 
        error: "CSS bundle failed", 
        message: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

