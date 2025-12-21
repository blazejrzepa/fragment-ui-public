"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@fragment_ui/ui";

interface AIPromptInputProps {
  onGenerate: (prompt: string, demoName?: string) => Promise<void>;
  isLoading?: boolean;
}

export function AIPromptInput({ onGenerate, isLoading = false }: AIPromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [demoName, setDemoName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await onGenerate(prompt.trim(), demoName.trim() || undefined);
    setPrompt("");
    setDemoName("");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>AI Playground</CardTitle>
        <CardDescription>
          Describe what you want to build, and AI will generate a complete component using Fragment UI.
        </CardDescription>
        <div className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
          <strong>Examples:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>"Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"</li>
            <li>"Stwórz formularz kontaktowy z polami: imię, email, wiadomość"</li>
            <li>"List View z tabelą i paginacją"</li>
            <li>"Dashboard z kartami i metrykami"</li>
          </ul>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="demo-name" className="text-sm font-medium">
              Demo Name (optional)
            </label>
            <Input
              id="demo-name"
              value={demoName}
              onChange={(e) => setDemoName(e.target.value)}
              placeholder="e.g., Registration Form"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              What do you want to build?
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Zbuduj formularz rejestracyjny z polami A, B i C..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" variant="solid" disabled={isLoading || !prompt.trim()}>
            {isLoading ? "Generating..." : "Generate Component"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

