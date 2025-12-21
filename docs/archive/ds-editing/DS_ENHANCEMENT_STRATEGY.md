# Strategia Ulepszenia Komponentów Design System

## 🎯 Problem

**Portal wygląda dobrze dzięki customowym komponentom, ale komponenty DS są mniej dopracowane.**

Customowe komponenty w portalu mają:
- ✅ Lepsze UX (animacje, transitions, hover effects)
- ✅ Zaawansowane funkcjonalności (scroll detection, wheel handling)
- ✅ Lepsze style (backdrop blur, custom colors, spacing)
- ✅ Integracje (Logo, Search, ThemeToggle)
- ✅ Responsywność (mobile-first, breakpoints)

Komponenty DS są bardziej podstawowe i nie mają tych funkcji.

## 🔄 Strategia: "Harvest & Enhance"

**Zamiast migrować customowe komponenty "as-is", najpierw ulepszmy komponenty DS, aby były tak dobre jak customowe.**

### Proces:

1. **Analiza** - Znajdź różnice między customowym a DS komponentem
2. **Harvest** - Wyciągnij najlepsze praktyki z customowego komponentu
3. **Enhance** - Ulepsz komponent DS o te praktyki
4. **Migracja** - Zastąp customowy komponent ulepszonym DS komponentem

## 📊 Analiza Różnic

### 1. TopNavigation vs NavigationMenu

#### Customowy TopNavigation ma:
- ✅ **Backdrop blur effect:**
  ```tsx
  backgroundColor: "color-mix(in srgb, var(--background-primary) 60%, transparent)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  ```
- ✅ **Fixed positioning z odpowiednimi stylami:**
  ```tsx
  className="fixed top-0 left-0 right-0 z-50"
  style={{ height: "60px" }}
  ```
- ✅ **Responsywność (mobile/desktop):**
  ```tsx
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
  }, []);
  ```
- ✅ **Integrację z Logo, Search, ThemeToggle**
- ✅ **Separatory z customowymi stylami:**
  ```tsx
  style={{
    borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
  }}
  ```
- ✅ **Hover effects na GitHub icon:**
  ```tsx
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
  }}
  ```

#### NavigationMenu DS ma:
- ❌ Brak backdrop blur
- ❌ Brak fixed positioning
- ❌ Brak responsywności
- ❌ Brak integracji z innymi komponentami
- ❌ Podstawowe style

### 2. SidebarNavigation vs Sheet

#### Customowy SidebarNavigation ma:
- ✅ **Zaawansowaną logikę scroll detection:**
  ```tsx
  const [isMainAtBottom, setIsMainAtBottom] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollTop + windowHeight >= documentHeight - threshold;
      setIsMainAtBottom(isAtBottom);
    };
    window.addEventListener("scroll", handleScroll);
  }, []);
  ```
- ✅ **Wheel event handling:**
  ```tsx
  const handleWheel = (e: WheelEvent) => {
    const nav = navRef.current;
    if (!nav) return;
    // Redirect wheel events to nav when at bottom
  };
  ```
- ✅ **Responsywność**
- ✅ **Zaawansowane style i animacje**

#### Sheet DS ma:
- ❌ Brak scroll detection
- ❌ Brak wheel handling
- ❌ Podstawowe style

### 3. CodeBlock Custom vs CodeBlock DS (brak)

#### Customowy CodeBlock ma:
- ✅ **Syntax highlighting przez API route:**
  ```tsx
  const response = await fetch("/api/highlight-code", {
    method: "POST",
    body: JSON.stringify({ code, language }),
  });
  ```
- ✅ **Loading states:**
  ```tsx
  const [isLoading, setIsLoading] = React.useState(true);
  ```
- ✅ **Theme-aware styling:**
  ```tsx
  color: effectiveTheme === "dark" ? "var(--color-fg-base)" : "var(--foreground-primary)",
  ```
- ✅ **Copy functionality** (w DocLayout)

#### CodeBlock DS:
- ❌ Nie istnieje w DS

### 4. DocLayout Custom vs Layout DS (brak)

#### Customowy DocLayout ma:
- ✅ **Auto-extraction headings:**
  ```tsx
  const extractHeadings = () => {
    const headingElements = article.querySelectorAll("h2, h3, h4, h5, h6");
    // Extract and generate IDs
  };
  ```
- ✅ **TableOfContents integration**
- ✅ **Copy button functionality**
- ✅ **Version support**

#### Layout DS:
- ❌ Nie istnieje w DS

## 🚀 Plan Ulepszenia Komponentów DS

### Faza 1: Ulepsz Podstawowe Komponenty (1-2 tygodnie)

#### 1.1 NavigationMenu Enhancement

**Dodaj do `packages/ui/src/navigation-menu.tsx`:**

```tsx
// Props dla backdrop blur
interface NavigationMenuProps {
  variant?: "default" | "header"; // header = backdrop blur + fixed
  blur?: boolean;
  height?: string;
}

// Wariant "header" z backdrop blur
const NavigationMenu = ({ variant = "default", blur = false, height = "60px", ...props }) => {
  if (variant === "header") {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height,
          backgroundColor: blur 
            ? "color-mix(in srgb, var(--background-primary) 60%, transparent)"
            : "var(--background-primary)",
          backdropFilter: blur ? "blur(12px)" : "none",
          WebkitBackdropFilter: blur ? "blur(12px)" : "none",
        }}
      >
        <NavigationMenuPrimitive.Root {...props} />
      </header>
    );
  }
  return <NavigationMenuPrimitive.Root {...props} />;
};
```

**Dodaj do `packages/ui/src/styles.css`:**

```css
/* NavigationMenu header variant */
[data-radix-navigation-menu-root][data-variant="header"] {
  /* Backdrop blur styles */
}

/* Separator styles */
[data-radix-navigation-menu-separator] {
  border-color: color-mix(in srgb, var(--foreground-primary) 10%, transparent);
}
```

#### 1.2 Sheet Enhancement

**Dodaj do `packages/ui/src/sheet.tsx`:**

```tsx
// Props dla scroll detection
interface SheetProps {
  scrollDetection?: boolean; // Auto-detect scroll position
  wheelHandling?: boolean; // Handle wheel events
}

// Hook dla scroll detection
const useScrollDetection = (threshold = 10) => {
  const [isAtBottom, setIsAtBottom] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollTop + windowHeight >= documentHeight - threshold);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return isAtBottom;
};
```

### Faza 2: Utwórz Nowe Komponenty DS (2-3 tygodnie)

#### 2.1 CodeBlock Component

**Utwórz `packages/ui/src/code-block.tsx`:**

```tsx
interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
  showCopyButton?: boolean;
  highlightApiUrl?: string; // "/api/highlight-code" dla Next.js
}

export function CodeBlock({
  children,
  language = "typescript",
  className = "",
  showCopyButton = true,
  highlightApiUrl,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!highlightApiUrl) {
      setIsLoading(false);
      return;
    }

    const highlightCode = async () => {
      try {
        const response = await fetch(highlightApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: children.trim(), language }),
        });

        if (response.ok) {
          const { html } = await response.json();
          setHighlightedHtml(html);
        }
      } catch (error) {
        console.error("Code highlighting error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [children, language, highlightApiUrl]);

  // Render logic...
}
```

#### 2.2 TableOfContents Component

**Utwórz `packages/ui/src/table-of-contents.tsx`:**

```tsx
interface TableOfContentsProps {
  headings: Array<{ id: string; text: string; level: number }>;
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const handleScroll = () => {
      // Find active heading based on scroll position
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
      // Set activeId based on scroll position
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <nav className={className}>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} data-level={heading.level}>
            <a
              href={`#${heading.id}`}
              className={activeId === heading.id ? "active" : ""}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Helper function
export function extractHeadings(selector = "article"): Array<{ id: string; text: string; level: number }> {
  const article = document.querySelector(selector);
  if (!article) return [];

  const headingElements = article.querySelectorAll("h2, h3, h4, h5, h6");
  const extracted: Array<{ id: string; text: string; level: number }> = [];
  const seenIds = new Set<string>();

  headingElements.forEach((heading) => {
    // Generate ID if not present
    if (!heading.id) {
      const baseId = heading.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "";
      
      let uniqueId = baseId;
      let counter = 1;
      while (seenIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      seenIds.add(uniqueId);
      heading.id = uniqueId;
    }

    const level = parseInt(heading.tagName.charAt(1), 10);
    extracted.push({
      id: heading.id,
      text: heading.textContent || "",
      level,
    });
  });

  return extracted;
}
```

#### 2.3 DocumentationLayout Block

**Utwórz `packages/blocks/src/documentation-layout.tsx`:**

```tsx
interface DocumentationLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  showTableOfContents?: boolean;
  version?: string;
}

export function DocumentationLayout({
  children,
  header,
  sidebar,
  rightSidebar,
  showTableOfContents = true,
  version,
}: DocumentationLayoutProps) {
  const [headings, setHeadings] = React.useState<Array<{ id: string; text: string; level: number }>>([]);

  React.useEffect(() => {
    const extract = () => {
      const extracted = extractHeadings("article");
      setHeadings(extracted);
    };

    extract();
    const timeoutId = setTimeout(extract, 100);
    const timeoutId2 = setTimeout(extract, 500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [children]);

  return (
    <div className="mx-auto max-w-[1536px]">
      {header}
      <div className="flex" style={{ marginTop: "60px" }}>
        {sidebar}
        <main className="flex-1">
          <div className="px-3 lg:pl-8 lg:pr-[96px] pt-[58px] pb-8">
            {children}
          </div>
        </main>
        {rightSidebar && (
          <aside className="hidden xl:block w-64 flex-shrink-0">
            {showTableOfContents && headings.length > 0 && (
              <TableOfContents headings={headings} />
            )}
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
```

### Faza 3: Migracja Customowych Komponentów (1-2 tygodnie)

Po ulepszeniu komponentów DS, zastąp customowe komponenty:

1. **TopNavigation** → `NavigationMenu` z `variant="header"`
2. **SidebarNavigation** → `Sheet` z `scrollDetection={true}`
3. **CodeBlock** → `CodeBlock` z DS
4. **DocLayout** → `DocumentationLayout` z DS
5. **TableOfContents** → `TableOfContents` z DS

## 📋 Checklist Ulepszenia Komponentu DS

### Przed Migracją:

- [ ] Przeanalizuj customowy komponent
- [ ] Zidentyfikuj najlepsze praktyki
- [ ] Ulepsz komponent DS o te praktyki
- [ ] Dodaj props dla zaawansowanych funkcji
- [ ] Zaktualizuj style w `styles.css`
- [ ] Zaktualizuj dokumentację
- [ ] Przetestuj w różnych scenariuszach
- [ ] Zbuduj pakiet: `pnpm --filter @fragment_ui/ui build`

### Po Migracji:

- [ ] Zastąp customowy komponent ulepszonym DS
- [ ] Zweryfikuj działanie
- [ ] Usuń stary customowy komponent
- [ ] Zaktualizuj testy

## 🎯 Priorytety

### P0 - Najpierw Ulepsz, Potem Migruj:

1. **NavigationMenu** - Dodaj backdrop blur, fixed positioning, responsywność
2. **CodeBlock** - Utwórz nowy komponent z syntax highlighting
3. **TableOfContents** - Utwórz nowy komponent z auto-extraction

### P1 - Potem:

4. **Sheet** - Dodaj scroll detection, wheel handling
5. **DocumentationLayout** - Utwórz nowy block

## 💡 Zasady

### 1. Komponenty DS Muszą Być Reużywalne

```tsx
// ✅ DOBRZE - Props dla różnych wariantów
<NavigationMenu variant="header" blur={true} height="60px" />

// ❌ ŹLE - Hardcoded wartości
<NavigationMenu /> // Zawsze backdrop blur
```

### 2. Zaawansowane Funkcje Są Opcjonalne

```tsx
// ✅ DOBRZE - Opcjonalne funkcje
<Sheet scrollDetection={true} wheelHandling={true} />

// ❌ ŹLE - Zawsze włączone
<Sheet /> // Zawsze scroll detection
```

### 3. Backward Compatibility

```tsx
// ✅ DOBRZE - Domyślne wartości zachowują stare zachowanie
<NavigationMenu /> // Domyślnie variant="default"

// ❌ ŹLE - Breaking changes
<NavigationMenu /> // Teraz zawsze backdrop blur
```

## 📚 Przykład: Ulepszenie NavigationMenu

### PRZED (Podstawowy):

```tsx
// packages/ui/src/navigation-menu.tsx
const NavigationMenu = ({ className, ...props }) => (
  <NavigationMenuPrimitive.Root className={clsx("...", className)} {...props} />
);
```

### PO (Ulepszony):

```tsx
// packages/ui/src/navigation-menu.tsx
interface NavigationMenuProps {
  variant?: "default" | "header";
  blur?: boolean;
  height?: string;
  className?: string;
}

const NavigationMenu = ({ 
  variant = "default", 
  blur = false, 
  height = "60px",
  className,
  ...props 
}) => {
  if (variant === "header") {
    return (
      <header
        className={clsx("fixed top-0 left-0 right-0 z-50", className)}
        style={{
          height,
          backgroundColor: blur 
            ? "color-mix(in srgb, var(--background-primary) 60%, transparent)"
            : "var(--background-primary)",
          backdropFilter: blur ? "blur(12px)" : "none",
          WebkitBackdropFilter: blur ? "blur(12px)" : "none",
        }}
      >
        <NavigationMenuPrimitive.Root {...props} />
      </header>
    );
  }
  
  return <NavigationMenuPrimitive.Root className={className} {...props} />;
};
```

### Użycie w Portalu:

```tsx
// apps/www/src/components/conditional-layout.tsx
import { NavigationMenu } from "@fragment_ui/ui";

<NavigationMenu variant="header" blur={true} height="60px">
  {/* ... */}
</NavigationMenu>
```

## 🎨 Korzyści

- ✅ **DS jest lepsze** - Komponenty DS mają wszystkie funkcje customowych
- ✅ **Portal używa DS** - Portal jest przykładem użycia DS
- ✅ **Backward compatible** - Stare użycia nadal działają
- ✅ **Reużywalne** - Inne aplikacje mogą używać tych samych funkcji
- ✅ **Utrzymanie** - Jeden kod do utrzymania

---

**Następny Krok:** Rozpocznij od ulepszenia `NavigationMenu` o backdrop blur i fixed positioning.

