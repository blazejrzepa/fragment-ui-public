import type {
  Plugin,
  PluginManifest,
  PluginContext,
  ComponentGeneratorPlugin,
  ComponentGeneratorOptions,
  ComponentGeneratorResult,
  GeneratedFile,
} from "../../src/types.js";

export default class ComponentGeneratorPlugin implements ComponentGeneratorPlugin {
  manifest: PluginManifest = {
    id: "component-generator-plugin",
    name: "Component Generator Plugin",
    version: "0.1.0",
    description: "Generates Fragment UI components from templates",
    entry: "./index.js",
    capabilities: {
      componentGenerator: true,
    },
  };

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info("Component Generator Plugin initialized");
  }

  async generateComponent(
    options: ComponentGeneratorOptions
  ): Promise<ComponentGeneratorResult> {
    const { name, type = "ui", template = "basic" } = options;

    const componentName = this.toPascalCase(name);
    const componentPath = type === "block" ? "components/blocks" : "components/ui";
    const fileName = name.replace(/-/g, "/");

    const files: GeneratedFile[] = [];

    // Generate component file
    const componentContent = this.generateComponentFile(componentName, template);
    files.push({
      path: `${componentPath}/${fileName}.tsx`,
      content: componentContent,
      type: "component",
    });

    // Generate test file
    const testContent = this.generateTestFile(componentName);
    files.push({
      path: `${componentPath}/${fileName}.test.tsx`,
      content: testContent,
      type: "test",
    });

    // Generate story file
    const storyContent = this.generateStoryFile(componentName, name);
    files.push({
      path: `${componentPath}/${fileName}.stories.tsx`,
      content: storyContent,
      type: "story",
    });

    return {
      files,
      dependencies: ["react", "react-dom"],
      instructions: [
        `Component ${componentName} has been generated`,
        `Import it: import { ${componentName} } from "${componentPath}/${fileName}"`,
      ],
    };
  }

  async getTemplates(): Promise<string[]> {
    return ["basic", "with-props", "with-state"];
  }

  private generateComponentFile(name: string, template: string): string {
    const baseTemplate = `import * as React from "react";
import clsx from "clsx";

export interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  function ${name}({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx("${name.toLowerCase()}", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
`;

    if (template === "with-props") {
      return baseTemplate.replace(
        `export interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
}`,
        `export interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}`
      );
    }

    return baseTemplate;
  }

  private generateTestFile(name: string): string {
    return `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ${name} } from "./${name.toLowerCase()}";

describe("${name}", () => {
  it("renders", () => {
    render(<${name}>Test</${name}>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
`;
  }

  private generateStoryFile(name: string, kebabName: string): string {
    return `import type { Meta, StoryObj } from "@storybook/react";
import { ${name} } from "./${kebabName}";

const meta: Meta<typeof ${name}> = {
  title: "Components/${name}",
  component: ${name},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {
    children: "Hello, ${name}!",
  },
};
`;
  }

  private toPascalCase(str: string): string {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }
}

