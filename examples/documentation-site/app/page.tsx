export default function HomePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Welcome to Documentation Site Example</h1>
      <p>
        This is an example documentation site built with Fragment UI Documentation blocks.
        It demonstrates how to use <code>DocumentationHeader</code>, <code>DocumentationSidebar</code>,
        and <code>DocumentationLayout</code> together to create a complete documentation experience.
      </p>

      <h2>Features</h2>
      <ul>
        <li>Fixed header with backdrop blur</li>
        <li>Responsive sidebar navigation</li>
        <li>Auto-extracted Table of Contents</li>
        <li>Dark mode support</li>
        <li>Smooth scrolling</li>
      </ul>

      <h2>Getting Started</h2>
      <p>
        To get started with Fragment UI Documentation blocks, install the packages:
      </p>
      <pre><code>{`pnpm add @fragment_ui/blocks @fragment_ui/ui @fragment_ui/tokens`}</code></pre>

      <h2>Installation</h2>
      <p>
        Follow the installation guide to set up Fragment UI in your project.
      </p>

      <h3>Quick Start</h3>
      <p>
        Import the Documentation blocks and start building your documentation site.
      </p>

      <h2>Components</h2>
      <p>
        Explore the available components in the Components section.
      </p>

      <h2>Blocks</h2>
      <p>
        Check out the Blocks section to see pre-built layout components.
      </p>

      <h2>Guides</h2>
      <p>
        Read the guides to learn best practices and advanced usage.
      </p>
    </article>
  );
}

