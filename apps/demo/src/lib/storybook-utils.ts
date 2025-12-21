/**
 * Storybook utilities for Create Story feature
 */

export interface StoryConfig {
  componentName: string;
  componentPath: string;
  storiesPath?: string;
}

/**
 * Generate Storybook story file content
 */
export function generateStoryFile(
  componentCode: string,
  config: StoryConfig
): string {
  // Extract component name from code
  const componentNameMatch = componentCode.match(/function\s+(\w+)|const\s+(\w+)\s*=|export\s+default\s+function\s+(\w+)/);
  const componentName = componentNameMatch
    ? componentNameMatch[1] || componentNameMatch[2] || componentNameMatch[3] || config.componentName
    : config.componentName;
  
  // Extract imports from component code
  const importMatch = componentCode.match(/^import\s+.*?from\s+['"](.*?)['"];?$/gm);
  const imports = importMatch ? importMatch.join('\n') : '';
  
  // Generate story file
  return `import type { Meta, StoryObj } from '@storybook/react';
${imports}

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  render: () => <${componentName} />,
};

export const Playground: Story = {
  render: (args) => <${componentName} {...args} />,
};
`;
}

/**
 * Generate file path for story
 */
export function getStoryPath(componentPath: string, storiesPath?: string): string {
  if (storiesPath) {
    return storiesPath;
  }
  
  // Default: replace .tsx with .stories.tsx in same directory
  return componentPath.replace(/\.(tsx|ts|jsx|js)$/, '.stories.tsx');
}

