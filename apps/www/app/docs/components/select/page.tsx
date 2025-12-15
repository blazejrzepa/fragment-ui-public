"use client";

import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
import { DocumentContent } from "@fragment_ui/ui";
import { Apple, Banana, Cherry, Grape, Citrus } from "lucide-react";

export default function SelectPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="select" className="text-3xl font-medium mb-4">Select</h1>
      </div>
      <p className="mb-6 intro-text">
        Choose one option from a dropdown list.
      </p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Citrus Fruits</SelectLabel>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="lemon">Lemon</SelectItem>
                <SelectItem value="lime">Lime</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Berries</SelectLabel>
                <SelectItem value="strawberry">Strawberry</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`"use client"

import { 
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@fragment_ui/ui"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Citrus Fruits</SelectLabel>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="lemon">Lemon</SelectItem>
          <SelectItem value="lime">Lime</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Berries</SelectLabel>
          <SelectItem value="strawberry">Strawberry</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}`}</CodeBlock>
        </div>
      </div>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">
                <div className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  <span>Apple</span>
                </div>
              </SelectItem>
              <SelectItem value="banana">
                <div className="flex items-center gap-2">
                  <Banana className="h-4 w-4" />
                  <span>Banana</span>
                </div>
              </SelectItem>
              <SelectItem value="cherry">
                <div className="flex items-center gap-2">
                  <Cherry className="h-4 w-4" />
                  <span>Cherry</span>
                </div>
              </SelectItem>
              <SelectItem value="grape">
                <div className="flex items-center gap-2">
                  <Grape className="h-4 w-4" />
                  <span>Grape</span>
                </div>
              </SelectItem>
              <SelectItem value="orange">
                <div className="flex items-center gap-2">
                  <Citrus className="h-4 w-4" />
                  <span>Orange</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`"use client"

import { 
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem
} from "@fragment_ui/ui"
import { Apple, Banana, Cherry, Grape, Citrus } from "lucide-react"

export function SelectWithIcons() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">
          <div className="flex items-center gap-2">
            <Apple className="h-4 w-4" />
            <span>Apple</span>
          </div>
        </SelectItem>
        <SelectItem value="banana">
          <div className="flex items-center gap-2">
            <Banana className="h-4 w-4" />
            <span>Banana</span>
          </div>
        </SelectItem>
        <SelectItem value="cherry">
          <div className="flex items-center gap-2">
            <Cherry className="h-4 w-4" />
            <span>Cherry</span>
          </div>
        </SelectItem>
        <SelectItem value="grape">
          <div className="flex items-center gap-2">
            <Grape className="h-4 w-4" />
            <span>Grape</span>
          </div>
        </SelectItem>
        <SelectItem value="orange">
          <div className="flex items-center gap-2">
            <Citrus className="h-4 w-4" />
            <span>Orange</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/select.json</CodeBlock>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>Select supports keyboard navigation, screen readers and is compliant with WAI-ARIA combobox pattern.</p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-select--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}
