---
title: Introduction
description: What Fragment UI is, how it helps product teams, and the core ideas behind the system.
---

Fragment UI is a code-first design system for modern React applications. It's built on React, TypeScript, shadcn/ui and Tailwind CSS, and gives you a consistent set of components, design tokens, and ready-made blocks you can drop into real products.

You can use it like a regular component library – import a button, build a form, ship a dashboard – but under the hood it's structured so that both your team and AI tools can understand it, extend it, and keep it consistent over time.

Fragment UI is built around a few simple ideas:

- **Code-first & Open**: You own the source—typed, editable components in your repo.
- **Design Tokens**: Colors, spacing, type, i18n as reusable tokens.
- **Blocks & Components**: From atoms to full screens—build faster.
- **AI-Ready**: Predictable APIs so AI can generate and refactor safely.

<div role="alert" class="relative rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--typography-size-sm)] grid grid-cols-[16px_1fr] gap-x-[var(--space-3)] gap-y-[var(--space-1)] items-start bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)] border border-[color:var(--color-border-base)] mt-[var(--space-6)]">
  <svg class="h-4 w-4 translate-y-0.5 text-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
  <div class="col-start-2 min-w-0">
    <div class="font-medium tracking-tight mb-[var(--space-1)]">Fragment UI is currently in public alpha.</div>
    <div class="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)] leading-relaxed">
      The API and component list can still change. Use it for experiments, internal tools, and early adopters – not yet as a hard dependency in mission-critical production apps.
    </div>
  </div>
</div>

## Code-first & Open

Fragment UI doesn't hide anything behind a magical theme layer or opaque runtime. Components are just **plain React + TypeScript files** in your repository. Styles are expressed with **Tailwind** and design tokens. Everything lives in your own version control, next to the rest of your app.

In practice this means a few things:

- you can open any component and immediately see how it's built,  
- you can refactor and extend components the same way you do with your own code,  
- you're not locked into a black-box npm package that you're afraid to touch.

If you've ever tried to change the behavior of a library component and ended up with wrappers, overrides, and brittle workarounds – this is intentionally the opposite. You own the code; Fragment UI gives you a strong, consistent starting point.


## Design Tokens

Underneath the components and blocks sits a **comprehensive design token system**. Colors, spacing, typography, density, motion and even i18n/RTL helpers are all expressed as tokens.

Those tokens exist in a few forms at once:

- as CSS variables used directly in your styles,  
- as JSON structures you can consume in code or tooling,  
- as a consistent vocabulary that both humans and AI can rely on.

This shared language has two big effects:

1. Your UI becomes easier to keep consistent across themes, density modes and platforms.  
2. AI tools can make _informed_ decisions: they can choose the correct error color, the right padding for a button, or an appropriate heading style without inventing new values.

If a model is going to touch your UI, it will always touch tokens. Making those tokens intentional and well-documented is one of the highest-leverage places to invest.


## Blocks & Components

Buttons and inputs are essential, but teams ship value through **screens**: dashboards, settings pages, onboarding flows, navigation shells, and so on.

Fragment UI includes both:
- low-level components (accessible primitives built on shadcn/ui and Radix), and  
- higher-level blocks and example screens you can use as starting points.

The idea is simple: rather than starting from a blank page every time, you can begin from a sensible dashboard layout, settings page or shell, and adapt it to your product. AI tools can also use these blocks as reference patterns when generating new variants, which leads to more coherent results than building everything from atoms each time.

Over time, your own product screens can be promoted into blocks as well, so the design system grows with your actual use cases, not just with theoretical components.


## AI-Ready

Today, a lot of teams want AI tools (Cursor, Copilot, custom agents, internal generators) to help them build UI. The problem is that most codebases are not designed to be _readable_ for models. Names are inconsistent, tokens are primitive-only, and patterns vary from file to file.

Fragment UI is structured so that AI doesn't have to guess.

Components follow predictable patterns and naming. Design tokens carry **intent** (for example `color-status-error-bg` instead of just `red-6`). Layouts and screens can be described with a **UI-DSL** – a structured representation that's easier for a model to generate and validate than free-form JSX.

That lets AI do things like:

- generate a new dashboard using existing components and tokens,  
- propose alternative layouts for an existing screen,  
- refactor UI while staying within your design system.

Instead of "AI hallucinating Tailwind", you get AI composing UI from a system that was designed to be read, understood, and extended.


Fragment UI is meant to work well even if you never touch AI – but it's built so that when you do, your system is ready for it.
