"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@fragment_ui/ui";

export default function CardGridExample() {
  const cards = [
    { id: 1, title: "Card 1", description: "Description for card 1" },
    { id: 2, title: "Card 2", description: "Description for card 2" },
    { id: 3, title: "Card 3", description: "Description for card 3" },
    { id: 4, title: "Card 4", description: "Description for card 4" },
    { id: 5, title: "Card 5", description: "Description for card 5" },
    { id: 6, title: "Card 6", description: "Description for card 6" },
  ];

  return (
    <DocLayout>
      <h1 id="card-grid" className="text-3xl font-medium mb-4">Card Grid</h1>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Card Grid example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DocLayout>
  );
}

