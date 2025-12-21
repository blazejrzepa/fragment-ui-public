"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from "@fragment_ui/ui";

interface Demo {
  id: string;
  title: string;
  description: string;
  code: string;
  createdAt: string;
}

interface DemoListProps {
  demos: Demo[];
  onSelectDemo: (demo: Demo) => void;
  onDeleteDemo?: (demoId: string) => void;
}

export function DemoList({ demos, onSelectDemo, onDeleteDemo }: DemoListProps) {
  if (demos.length === 0) {
    return (
      <div className="text-center py-12 text-[color:var(--color-fg-muted)]">
        <p>No demos yet. Create your first one using the AI Playground above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demos.map((demo) => (
        <Card key={demo.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectDemo(demo)}>
          <CardHeader>
            <CardTitle className="text-lg">{demo.title}</CardTitle>
            <CardDescription className="text-xs">
              Created {new Date(demo.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[color:var(--color-fg-muted)] mb-4 line-clamp-2">
              {demo.description}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="solid"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDemo(demo);
                }}
              >
                View
              </Button>
              {onDeleteDemo && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDemo(demo.id);
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

