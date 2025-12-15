"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, Textarea, Badge, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@fragment_ui/ui";

const Dithering = dynamic(() => import("@paper-design/shaders-react").then((m) => m.Dithering), { ssr: false });
import { Infinity, Bot, Check, Link2, Globe, Image, Camera, ArrowUp } from "lucide-react";

export default function FragmentAIPage() {
  const [colors, setColors] = useState({
    front: "var(--color-fg-base)",
    back: "var(--background-primary)",
  });
  const [model, setModel] = useState("gpt-4o");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const styles = getComputedStyle(document.documentElement);
    const front = styles.getPropertyValue("--color-fg-base").trim() || "var(--color-fg-base)";
    const back = styles.getPropertyValue("--background-primary").trim() || "var(--background-primary)";
    setColors({ front, back });
    const timer = setTimeout(() => setIsReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-3">
          <div className="flex flex-col items-center gap-4 text-center text-[color:var(--color-fg-muted)]">
            <div className="h-10 w-10 rounded-full border-2 border-[color:var(--color-border-base)] border-t-[color:var(--color-fg-base)] animate-spin" aria-hidden />
            <p className="text-sm">Loading Fragment AI…</p>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-3">
        <div className="flex flex-col items-center text-center max-w-4xl w-full space-y-10">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center justify-center">
              <Dithering
                width={200}
                height={120}
                colorBack={colors.back}
                colorFront={colors.front}
                shape="sphere"
                type="8x8"
                size={2}
                speed={0.6}
                scale={0.9}
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold">Copilot AI</h1>
              <p className="intro-text text-[color:var(--foreground-secondary)]">Tell me what you need — I’ll build the first screen.</p>
            </div>
          </div>

          <Card className="shadow-sm w-full max-w-4xl mx-auto border-none">
            <CardContent className="space-y-6 w-full">
              <div className="rounded-2xl bg-[color:var(--color-surface-1)] p-5 pb-6 shadow-sm max-w-3xl mx-auto w-full">
                <Textarea
                  placeholder="Ask anything..."
                  className="min-h-[140px] w-full resize-none border-none bg-transparent p-0 text-base leading-6 text-[color:var(--color-fg-base)] placeholder:text-[color:var(--color-fg-muted)] focus:outline-none focus:ring-0"
                />

                <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-10 w-[140px] rounded-full border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-sm px-4">
                      <SelectValue placeholder="Choose AI" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
                      <SelectItem value="claude-3-5">Claude 3.5</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    {[Camera, Globe, Link2].map((Icon, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 rounded-full p-0 hover:bg-[color:var(--color-surface-2)]"
                        aria-label={`action-${idx}`}
                      >
                        <Icon className="w-4 h-4 text-[color:var(--color-fg-muted)]" />
                      </Button>
                    ))}
                    <Button variant="solid" size="sm" className="h-10 w-10 p-0 rounded-full !rounded-full leading-[0]" aria-label="Submit" style={{ borderRadius: "9999px" }}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-24 pt-2 flex flex-wrap justify-center gap-2 text-xs text-[color:var(--color-fg-muted)] w-full">
                {["Sales KPI dashboard", "Customer support overview", "Checkout conversion funnel", "Fraud risk monitor", "Subscription revenue analytics"].map((chip) => (
                  <Badge
                    key={chip}
                    variant="subtle"
                    className="px-3 py-2 text-sm transition-all duration-150 hover:-translate-y-[2px] hover:shadow-md hover:bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-border-base)] border border-transparent"
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
  );
}
