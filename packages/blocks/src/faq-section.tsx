"use client";

import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@fragment_ui/ui";
import clsx from "clsx";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  title?: string;
  description?: string;
  items: FAQItem[];
  className?: string;
}

export function FAQSection({
  title,
  description,
  items,
  className,
}: FAQSectionProps) {
  return (
    <section className={clsx("py-16", className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-fg-base)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-[color:var(--color-fg-muted)]">
                {description}
              </p>
            )}
          </div>
        )}
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[color:var(--color-fg-muted)]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

