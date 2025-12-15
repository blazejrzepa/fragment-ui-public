"use client";

import { FAQSection } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function FAQSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          FAQ Section
        </h1>
      </div>
      <p className="mb-6 intro-text">
        Expandable questions and answers for support content.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        FAQ Section displays frequently asked questions in an accordion format,
        allowing users to expand and collapse individual questions. Built on top
        of the Accordion component for consistent behavior.
      </p>
      
      {/* Default FAQ */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-3xl">
            <FAQSection
              title="Frequently Asked Questions"
              description="Everything you need to know"
              items={[
                {
                  question: "How does it work?",
                  answer:
                    "Our platform provides a simple, intuitive interface for managing your projects. Just sign up, create your first project, and start collaborating with your team.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer:
                    "Yes, you can cancel your subscription at any time. There are no cancellation fees, and you'll continue to have access until the end of your billing period.",
                },
                {
                  question: "Do you offer a free trial?",
                  answer:
                    "Yes! We offer a 14-day free trial with full access to all features. No credit card required.",
                },
              ]}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { FAQSection } from "@fragment_ui/blocks";

<FAQSection
  title="Frequently Asked Questions"
  description="Everything you need to know"
  items={[
    { question: "How does it work?", answer: "Explain the flow" },
    { question: "What payment methods do you accept?", answer: "List methods" },
    { question: "Can I cancel my subscription anytime?", answer: "Yes, anytime" },
  ]}
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Minimal FAQ</h3>
          <FAQSection
            items={[
              {
                question: "How does it work?",
                answer:
                  "Our platform provides a simple, intuitive interface for managing your projects.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time with no cancellation fees.",
              },
            ]}
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { FAQSection } from "@fragment_ui/blocks";

function HelpPage() {
  return (
    <FAQSection
      title="Frequently Asked Questions"
      description="Everything you need to know"
      items={[
        { question: "How does it work?", answer: "Explain the flow" },
        { question: "What payment methods do you accept?", answer: "List methods" },
        { question: "Can I cancel anytime?", answer: "Yes, cancel anytime" },
      ]}
    />
  );
}`}
      </CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Section title (optional)
        </li>
        <li>
          <code>description</code> - Section description (optional)
        </li>
        <li>
          <code>items</code> - Array of FAQ items (required)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>FAQItem</h3>
      <ul>
        <li>
          <code>question</code> - FAQ question (required)
        </li>
        <li>
          <code>answer</code> - FAQ answer (required)
        </li>
      </ul>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/faq-section.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        FAQ section uses the Accordion component which provides full keyboard
        navigation, ARIA attributes, and screen reader support. Questions are
        properly labeled and answers are associated with their questions.
        Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li></li>
      </ul>
    </DocumentContent>
  );
}

