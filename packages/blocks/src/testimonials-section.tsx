"use client";

import * as React from "react";
import { Card, CardContent } from "@fragment_ui/ui";
import { Avatar } from "@fragment_ui/ui";
import clsx from "clsx";

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
}

export interface TestimonialsSectionProps {
  title?: string;
  description?: string;
  items: Testimonial[];
  layout?: "grid" | "carousel";
  columns?: 2 | 3;
  className?: string;
}

export function TestimonialsSection({
  title,
  description,
  items = [],
  layout = "grid",
  columns = 3,
  className,
}: TestimonialsSectionProps) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <section className={clsx("py-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-fg-base)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-[color:var(--color-fg-muted)] max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={clsx("grid gap-6", gridCols[columns])}>
          {items.map((item, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-[color:var(--color-fg-base)] italic">
                    "{item.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  {item.avatar ? (
                    <Avatar src={item.avatar} alt={item.author} />
                  ) : (
                    <Avatar>
                      {item.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </Avatar>
                  )}
                  <div>
                    <div className="font-semibold text-[color:var(--color-fg-base)]">
                      {item.author}
                    </div>
                    {(item.role || item.company) && (
                      <div className="text-sm text-[color:var(--color-fg-muted)]">
                        {item.role}
                        {item.role && item.company && ", "}
                        {item.company}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

