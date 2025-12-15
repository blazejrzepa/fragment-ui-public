import fs from "node:fs";
import path from "node:path";

export async function ensureDocPage(name: string) {
  const dir = path.join(process.cwd(), "apps/www/app/docs/components", name);
  const file = path.join(dir, "page.tsx");
  if (fs.existsSync(file)) return;

  fs.mkdirSync(dir, { recursive: true });
  const Title =
    name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || name.charAt(0).toUpperCase() + name.slice(1);

  const code = `export default function Page() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>${Title}</h1>
      <h2>Overview</h2>
      <p>Krótki opis użycia komponentu.</p>
      <h2>Install</h2>
      <pre><code>npx shadcn@latest add /r/${name}.json</code></pre>
      <h2>Examples</h2>
      <h2>Accessibility</h2>
      <h2>Links</h2>
      <ul>
        <li>
          <a href="/storybook/?path=/docs/core-${name}--docs">Storybook</a>
        </li>
      </ul>
    </article>
  );
}
`;
  fs.writeFileSync(file, code);
  console.log(`✔ Created docs page: /docs/components/${name}`);
}

