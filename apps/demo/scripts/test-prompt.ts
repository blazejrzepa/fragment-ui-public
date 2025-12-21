#!/usr/bin/env tsx
/**
 * Automated Testing Script for AI Playground
 * 
 * Usage:
 *   pnpm test-prompt "Zbuduj formularz rejestracyjny z polami: email, hasło"
 *   pnpm test-prompt "List View z tabelą i paginacją" --browser
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface TestResult {
  prompt: string;
  success: boolean;
  errors: string[];
  warnings: string[];
  codeGenerated: boolean;
  codeValid: boolean;
  propsValid: boolean;
  renderValid: boolean;
  uiValid: boolean;
  uiChecks: {
    elementsVisible: boolean;
    interactiveElements: boolean;
    accessibility: boolean;
    formFunctional: boolean;
  };
}

/**
 * Test a prompt by generating code and validating it
 */
async function testPrompt(
  prompt: string,
  options: { browser?: boolean; verbose?: boolean } = {}
): Promise<TestResult> {
  const result: TestResult = {
    prompt,
    success: false,
    errors: [],
    warnings: [],
    codeGenerated: false,
    codeValid: false,
    propsValid: false,
    renderValid: false,
    uiValid: false,
    uiChecks: {
      elementsVisible: false,
      interactiveElements: false,
      accessibility: false,
      formFunctional: false,
    },
  };

  console.log(`\n🧪 Testing prompt: "${prompt}"\n`);

  try {
    // Step 1: Generate code via API
    console.log("📝 Step 1: Generating code...");
    const generatedCode = await generateCode(prompt);
    
    if (!generatedCode) {
      result.errors.push("Failed to generate code");
      return result;
    }
    
    result.codeGenerated = true;
    console.log("✅ Code generated successfully");

    // Step 2: Validate code syntax
    console.log("\n🔍 Step 2: Validating code syntax...");
    const syntaxValid = validateCodeSyntax(generatedCode);
    result.codeValid = syntaxValid.valid;
    
    if (!syntaxValid.valid) {
      result.errors.push(...syntaxValid.errors);
      console.log("❌ Code syntax validation failed");
    } else {
      console.log("✅ Code syntax is valid");
    }

    // Step 3: Validate component props
    console.log("\n🔍 Step 3: Validating component props...");
    const propsValid = validateComponentProps(generatedCode);
    result.propsValid = propsValid.valid;
    
    if (!propsValid.valid) {
      result.warnings.push(...propsValid.missing.map(
        m => `Missing required props for ${m.component}: ${m.props.join(", ")}`
      ));
      console.log("⚠️  Some components are missing required props");
    } else {
      console.log("✅ All components have required props");
    }

    // Step 4: Test rendering (if browser option is enabled)
    if (options.browser) {
      console.log("\n🌐 Step 4: Testing rendering in browser...");
      const renderValid = await testRendering(generatedCode, options.verbose);
      result.renderValid = renderValid.valid;
      
      if (!renderValid.valid) {
        result.errors.push(...renderValid.errors);
        result.warnings.push(...renderValid.warnings);
        console.log("❌ Rendering test failed");
      } else {
        console.log("✅ Component renders successfully");
        
        // Step 5: Test UI correctness
        console.log("\n🎨 Step 5: Testing UI correctness...");
        const uiValid = await testUIVisual(generatedCode, options.verbose);
        result.uiValid = uiValid.valid;
        result.uiChecks = uiValid.checks;
        
        if (!uiValid.valid) {
          result.errors.push(...uiValid.errors);
          result.warnings.push(...uiValid.warnings);
          console.log("❌ UI validation failed");
        } else {
          console.log("✅ UI is correct");
          console.log(`  - Elements visible: ${uiValid.checks.elementsVisible ? "✅" : "❌"}`);
          console.log(`  - Interactive elements: ${uiValid.checks.interactiveElements ? "✅" : "❌"}`);
          console.log(`  - Accessibility: ${uiValid.checks.accessibility ? "✅" : "❌"}`);
          console.log(`  - Form functional: ${uiValid.checks.formFunctional ? "✅" : "❌"}`);
        }
      }
    }

    // Determine overall success
    result.success = result.codeGenerated && 
                     result.codeValid && 
                     result.propsValid && 
                     (!options.browser || (result.renderValid && result.uiValid));

  } catch (error) {
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * Generate code by calling the API endpoint
 */
async function generateCode(prompt: string): Promise<string | null> {
  try {
    const baseUrl = process.env.DEMO_URL || "http://localhost:3002";
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate code");
    }

    const data = await response.json();
    return data.code || null;
  } catch (error) {
    console.error("Error generating code:", error);
    return null;
  }
}

/**
 * Validate code syntax using Babel
 */
function validateCodeSyntax(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    // Try to require @babel/standalone
    const Babel = require("@babel/standalone");
    
    Babel.transform(code, {
      presets: [
        ["react", { runtime: "classic" }],
        ["typescript", { isTSX: true, allExtensions: true }],
      ],
    });
  } catch (error) {
    errors.push(`Syntax error: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate that all components have required props
 */
function validateComponentProps(code: string): {
  valid: boolean;
  missing: Array<{ component: string; props: string[] }>;
} {
  const missing: Array<{ component: string; props: string[] }> = [];
  
  // Required props for common components
  const requiredProps: Record<string, string[]> = {
    Pagination: ["currentPage", "totalPages", "onPageChange"],
    Select: ["value", "onValueChange"], // Or sub-components
  };
  
  // Check for each component
  Object.entries(requiredProps).forEach(([component, props]) => {
    // Check if component is used in code
    if (code.includes(`<${component}`) || code.includes(`${component}(`)) {
      const missingProps: string[] = [];
      
      props.forEach(prop => {
        // Check if prop is present (simple regex check)
        const propPattern = new RegExp(`${prop}\\s*[:=]`, "i");
        if (!propPattern.test(code)) {
          missingProps.push(prop);
        }
      });
      
      if (missingProps.length > 0) {
        missing.push({ component, props: missingProps });
      }
    }
  });
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Test rendering in browser using Playwright
 */
async function testRendering(
  code: string,
  verbose: boolean = false
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Check if Playwright is available
    try {
      require.resolve("playwright");
    } catch {
      errors.push("Playwright is not installed. Run: pnpm add -D playwright");
      return { valid: false, errors, warnings };
    }
    
    const { chromium } = require("playwright");
    
    // Create a temporary HTML file with the component
    const tempDir = path.join(process.cwd(), ".test-temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const htmlFile = path.join(tempDir, "test-component.html");
    const html = generateTestHTML(code);
    fs.writeFileSync(htmlFile, html);
    
    // Launch browser and test
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Collect console messages
    const consoleMessages: string[] = [];
    page.on("console", (msg: any) => {
      const text = msg.text();
      if (msg.type() === "error") {
        errors.push(`Console error: ${text}`);
      } else if (msg.type() === "warning") {
        warnings.push(`Console warning: ${text}`);
      }
      consoleMessages.push(`[${msg.type()}] ${text}`);
    });
    
    // Load the page
    await page.goto(`file://${htmlFile}`);
    
    // Wait for React to render
    await page.waitForTimeout(2000);
    
    // Check if component rendered
    const hasContent = await page.evaluate(() => {
      return document.body.innerHTML.length > 0;
    });
    
    if (!hasContent) {
      errors.push("Component did not render any content");
    }
    
    await browser.close();
    
    // Cleanup
    fs.unlinkSync(htmlFile);
    
    if (verbose && consoleMessages.length > 0) {
      console.log("\n📋 Console messages:");
      consoleMessages.forEach(msg => console.log(`  ${msg}`));
    }
    
  } catch (error) {
    errors.push(`Rendering test error: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Test UI visual correctness and functionality
 */
async function testUIVisual(
  code: string,
  verbose: boolean = false
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    elementsVisible: boolean;
    interactiveElements: boolean;
    accessibility: boolean;
    formFunctional: boolean;
  };
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks = {
    elementsVisible: false,
    interactiveElements: false,
    accessibility: false,
    formFunctional: false,
  };
  
  try {
    const { chromium } = require("playwright");
    
    const tempDir = path.join(process.cwd(), ".test-temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const htmlFile = path.join(tempDir, "test-component.html");
    const html = generateTestHTML(code);
    fs.writeFileSync(htmlFile, html);
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`file://${htmlFile}`);
    await page.waitForTimeout(2000);
    
    // Check 1: Elements are visible
    try {
      const visibleElements = await page.evaluate(() => {
        const body = document.body;
        const hasText = body.innerText.trim().length > 0;
        const hasElements = body.querySelectorAll('*').length > 1; // More than just root div
        const hasVisibleElements = Array.from(body.querySelectorAll('*')).some(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });
        return hasText && hasElements && hasVisibleElements;
      });
      
      checks.elementsVisible = visibleElements;
      if (!visibleElements) {
        errors.push("No visible elements found on page");
      }
    } catch (error) {
      warnings.push(`Could not check element visibility: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check 2: Interactive elements work
    try {
      const interactiveWorks = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const inputs = document.querySelectorAll('input, textarea, select');
        const links = document.querySelectorAll('a[href]');
        
        const hasInteractive = buttons.length > 0 || inputs.length > 0 || links.length > 0;
        
        // Try clicking a button if available
        if (buttons.length > 0) {
          const firstButton = buttons[0] as HTMLButtonElement;
          return !firstButton.disabled;
        }
        
        return hasInteractive;
      });
      
      checks.interactiveElements = interactiveWorks;
      if (!interactiveWorks) {
        warnings.push("No interactive elements found or they are disabled");
      }
    } catch (error) {
      warnings.push(`Could not check interactivity: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check 3: Basic accessibility
    try {
      const a11yValid = await page.evaluate(() => {
        // Check for basic accessibility features
        const hasLabels = document.querySelectorAll('label').length > 0;
        const inputs = document.querySelectorAll('input, textarea, select');
        const inputsWithLabels = Array.from(inputs).some(input => {
          const id = input.getAttribute('id');
          if (id) {
            return document.querySelector(`label[for="${id}"]`) !== null;
          }
          return input.closest('label') !== null;
        });
        
        // Check for ARIA attributes
        const hasAria = document.querySelectorAll('[aria-label], [aria-labelledby], [role]').length > 0;
        
        // Check for semantic HTML
        const hasSemantic = document.querySelectorAll('form, button, input, label, nav, header, main, footer').length > 0;
        
        return hasSemantic && (hasLabels || inputsWithLabels || hasAria);
      });
      
      checks.accessibility = a11yValid;
      if (!a11yValid) {
        warnings.push("Basic accessibility checks failed - missing labels or ARIA attributes");
      }
    } catch (error) {
      warnings.push(`Could not check accessibility: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check 4: Form functionality (if form exists)
    try {
      const formWorks = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        if (forms.length === 0) {
          return true; // No form, so it's not applicable
        }
        
        const form = forms[0] as HTMLFormElement;
        const inputs = form.querySelectorAll('input, textarea, select');
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        // Check if form has inputs and submit button
        return inputs.length > 0 && submitButton !== null;
      });
      
      checks.formFunctional = formWorks;
      if (!formWorks) {
        warnings.push("Form found but may not be functional - missing inputs or submit button");
      }
    } catch (error) {
      warnings.push(`Could not check form functionality: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Take screenshot if verbose
    if (verbose) {
      const screenshotPath = path.join(tempDir, "screenshot.png");
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`\n📸 Screenshot saved to: ${screenshotPath}`);
    }
    
    await browser.close();
    fs.unlinkSync(htmlFile);
    
  } catch (error) {
    errors.push(`UI test error: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  const allChecksPass = Object.values(checks).every(check => check === true);
  
  return {
    valid: allChecksPass && errors.length === 0,
    errors,
    warnings,
    checks,
  };
}

/**
 * Generate HTML file for testing component
 */
function generateTestHTML(code: string): string {
  // Clean code for browser execution
  let cleanCode = code
    .replace(/"use client";?\s*\n?/g, "")
    .replace(/import\s+.*?from\s+["'][^"']+["'];?\s*\n?/g, "")
    .trim();
  
  // Extract component name
  const componentMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/) ||
                        cleanCode.match(/function\s+(\w+)\s*\(/);
  const componentName = componentMatch ? componentMatch[1] : "GeneratedComponent";
  
  // Remove export default
  cleanCode = cleanCode.replace(/export\s+default\s+function\s+(\w+)/g, "function $1");
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Component Test</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    const { useState, useEffect, useRef, useCallback } = React;
    
    // Mock Fragment UI components (simplified)
    const FragmentUI = {
      Button: ({ children, onClick, variant, ...props }) => 
        React.createElement('button', { onClick, className: 'px-4 py-2 bg-blue-500 text-white rounded', ...props }, children),
      Input: ({ value, onChange, type, placeholder, ...props }) => 
        React.createElement('input', { value, onChange, type, placeholder, className: 'px-3 py-2 border rounded', ...props }),
      Card: ({ children, ...props }) => 
        React.createElement('div', { className: 'p-4 border rounded', ...props }, children),
      CardHeader: ({ children, ...props }) => 
        React.createElement('div', { className: 'mb-4', ...props }, children),
      CardTitle: ({ children, ...props }) => 
        React.createElement('h2', { className: 'text-xl font-bold', ...props }, children),
      CardContent: ({ children, ...props }) => 
        React.createElement('div', { ...props }, children),
      FormField: ({ label, children, ...props }) => 
        React.createElement('div', { className: 'mb-4', ...props }, 
          label && React.createElement('label', { className: 'block mb-1' }, label),
          children
        ),
      Pagination: ({ currentPage, totalPages, onPageChange, ...props }) => 
        React.createElement('nav', { className: 'flex gap-2', ...props },
          React.createElement('button', { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1 }, '‹'),
          React.createElement('span', {}, \`Page \${currentPage} of \${totalPages}\`),
          React.createElement('button', { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages }, '›')
        ),
      // Add more components as needed
    };
    
    // Make components available globally
    Object.keys(FragmentUI).forEach(key => {
      window[key] = FragmentUI[key];
    });
    
    // Validation functions
    window.validateValue = (value, rules) => {
      if (!rules) return undefined;
      if (rules.required && (!value || value === '')) {
        return rules.required.message || 'This field is required';
      }
      return undefined;
    };
    window.ValidationRules = {};
    
    // Component code
    ${cleanCode}
    
    // Render component
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  </script>
</body>
</html>`;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: pnpm test-prompt "<prompt>" [options]

Options:
  --browser    Test rendering in browser (requires Playwright)
  --verbose    Show detailed output

Examples:
  pnpm test-prompt "Zbuduj formularz rejestracyjny z polami: email, hasło"
  pnpm test-prompt "List View z tabelą i paginacją" --browser
    `);
    process.exit(1);
  }
  
  const prompt = args[0];
  const options = {
    browser: args.includes("--browser"),
    verbose: args.includes("--verbose"),
  };
  
  const result = await testPrompt(prompt, options);
  
  // Print results
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Results");
  console.log("=".repeat(60));
  console.log(`Prompt: "${result.prompt}"`);
  console.log(`Status: ${result.success ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`\nChecks:`);
  console.log(`  Code Generated: ${result.codeGenerated ? "✅" : "❌"}`);
  console.log(`  Code Valid: ${result.codeValid ? "✅" : "❌"}`);
  console.log(`  Props Valid: ${result.propsValid ? "✅" : "❌"}`);
  if (options.browser) {
    console.log(`  Render Valid: ${result.renderValid ? "✅" : "❌"}`);
    console.log(`  UI Valid: ${result.uiValid ? "✅" : "❌"}`);
    if (result.uiChecks) {
      console.log(`\nUI Checks:`);
      console.log(`  Elements Visible: ${result.uiChecks.elementsVisible ? "✅" : "❌"}`);
      console.log(`  Interactive Elements: ${result.uiChecks.interactiveElements ? "✅" : "❌"}`);
      console.log(`  Accessibility: ${result.uiChecks.accessibility ? "✅" : "❌"}`);
      console.log(`  Form Functional: ${result.uiChecks.formFunctional ? "✅" : "❌"}`);
    }
  }
  
  if (result.errors.length > 0) {
    console.log(`\n❌ Errors (${result.errors.length}):`);
    result.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
    result.warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning}`);
    });
  }
  
  console.log("=".repeat(60) + "\n");
  
  process.exit(result.success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { testPrompt, generateCode, validateCodeSyntax, validateComponentProps };

