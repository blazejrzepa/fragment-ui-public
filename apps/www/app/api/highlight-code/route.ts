import { NextRequest, NextResponse } from "next/server";
import { codeToHtml } from "shiki/bundle/web";

export async function POST(request: NextRequest) {
  try {
    const { code, language = "typescript", showLineNumbers = true } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    let html = await codeToHtml(code.trim(), {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });

    // Post-process HTML to ensure proper styling
    html = html.replace(/<pre([^>]*)>/gi, (match, attrs) => {
      const styleMatch = attrs.match(/style=["']([^"']*)["']/i);
      if (styleMatch) {
        let style = styleMatch[1];
        // Remove existing styles we want to override
        style = style.replace(/padding[^;]*;?/gi, "").trim();
        style = style.replace(/line-height[^;]*;?/gi, "").trim();
        style = style.replace(/max-height[^;]*;?/gi, "").trim();
        style = style.replace(/overflow-y[^;]*;?/gi, "").trim();
        style = style.replace(/margin[^;]*;?/gi, "").trim();
        // Add our styles
        const newStyles = "padding: 1rem 1.25rem !important; line-height: 1.7 !important; max-height: 400px !important; overflow-y: auto !important; margin: 0 !important;";
        style = style ? `${style}; ${newStyles}` : newStyles;
        style = style.replace(/;\s*;/g, ";").replace(/^\s*;|;\s*$/g, "");
        return `<pre${attrs.replace(/style=["']([^"']*)["']/i, `style="${style}"`)}>`;
      }
      return `<pre${attrs} style="padding: 1rem 1.25rem !important; line-height: 1.7 !important; max-height: 400px !important; overflow-y: auto !important; margin: 0 !important;">`;
    });

    // Add line numbers if requested
    if (showLineNumbers) {
      // Add class and data-line-numbers attribute to code element for line numbers
      html = html.replace(/<code([^>]*)>/gi, (match, attrs) => {
        let newAttrs = attrs;
        
        // Add class="line-numbers" if not present
        if (attrs.includes('class=')) {
          if (!attrs.includes('line-numbers')) {
            newAttrs = newAttrs.replace(/class="([^"]*)"/, 'class="$1 line-numbers"');
          }
        } else {
          newAttrs = `${newAttrs} class="line-numbers"`;
        }
        
        // Add data-line-numbers attribute if not present
        if (!newAttrs.includes('data-line-numbers')) {
          newAttrs = `${newAttrs} data-line-numbers=""`;
        }
        
        return `<code${newAttrs}>`;
      });

      // Add line numbers to each line
      let lineNumber = 1;
      html = html.replace(/<span class="line"([^>]*)>/gi, (match, attrs) => {
        const styleMatch = attrs.match(/style=["']([^"']*)["']/i);
        let newAttrs = attrs;
        if (styleMatch) {
          let style = styleMatch[1];
          style = style.replace(/padding-left[^;]*;?/gi, "").trim();
          style = style.replace(/line-height[^;]*;?/gi, "").trim();
          const newStyles = "padding-left: 4em !important; line-height: 1.7 !important;";
          style = style ? `${style}; ${newStyles}` : newStyles;
          style = style.replace(/;\s*;/g, ";").replace(/^\s*;|;\s*$/g, "");
          newAttrs = newAttrs.replace(/style=["']([^"']*)["']/i, `style="${style}"`);
        } else {
          newAttrs = `${newAttrs} style="padding-left: 4em !important; line-height: 1.7 !important;"`;
        }
        return `<span class="line"${newAttrs} data-line="${lineNumber++}">`;
      });
    }

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Code highlighting error:", error);
    return NextResponse.json(
      { error: "Failed to highlight code" },
      { status: 500 }
    );
  }
}

