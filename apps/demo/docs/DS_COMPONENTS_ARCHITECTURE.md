# Architektura Renderowania DS Components - Propozycja

## 📋 Analiza Obecnych Problemów

### 1. **Hardcoded Logika dla Komponentów**
**Problem:** Każdy komponent wymaga indywidualnej obsługi w kodzie
```typescript
// ❌ Obecne podejście - hardcoded dla każdego komponentu
if (componentName === "PasswordInput") {
  actualComponentName = "Input";
} else if (isAlertDialog) {
  // specjalna logika dla AlertDialog
}
```

**Konsekwencje:**
- Każdy nowy komponent wymaga zmian w kodzie
- Trudne do utrzymania i skalowania
- Łatwo o błędy przy dodawaniu nowych komponentów

### 2. **Brak Centralnego Systemu Metadanych**
**Problem:** Brak strukturyzowanych metadanych o komponentach
- Nie wiemy, które komponenty wymagają podkomponentów
- Nie wiemy, które komponenty używają React Context
- Nie wiemy, które komponenty są self-closing
- Nie wiemy, które komponenty mają specjalne wymagania renderowania

### 3. **Problemy z React Context w Worker/Iframe**
**Problem:** Komponenty używające `createContext` nie działają w worker/iframe
```
TypeError: Cannot read properties of null (reading 'useMemo')
at create-context.tsx:91:20
at A (alert-dialog.tsx:28:23)
```

**Przyczyna:** React Context wymaga React Provider, który nie jest dostępny w izolowanym środowisku worker/iframe

### 4. **Brak Walidacji Przed Renderowaniem**
**Problem:** Kod generuje komponenty bez sprawdzania, czy faktycznie istnieją
- Aliasy nie są walidowane
- Eksporty nie są sprawdzane
- Błędy wykrywane dopiero w runtime

### 5. **Brak Fallback Systemu**
**Problem:** Gdy komponent nie może być wyrenderowany, brak informacji dla użytkownika
- Brak komunikatu o przyczynie błędu
- Brak sugestii rozwiązania
- Użytkownik nie wie, co poszło nie tak

---

## 🏗️ Proponowana Architektura

### 1. **Component Metadata System**

#### Struktura Registry z Rozszerzonymi Metadanymi

```typescript
// apps/demo/registry.json - rozszerzona struktura
{
  "components": {
    "AlertDialog": {
      "import": "@fragment_ui/ui/alert",
      "type": "compound", // simple | compound | context-dependent
      "requiresSubcomponents": [
        "AlertDialogTrigger",
        "AlertDialogContent",
        "AlertDialogHeader",
        "AlertDialogTitle",
        "AlertDialogDescription",
        "AlertDialogFooter",
        "AlertDialogCancel",
        "AlertDialogAction"
      ],
      "requiresContext": true, // czy używa React Context
      "example": {
        "type": "full", // minimal | full | interactive
        "code": "pre-generated-example-code.tsx"
      },
      "props": { /* ... */ }
    },
    "Input": {
      "import": "@fragment_ui/ui/input",
      "type": "simple",
      "selfClosing": true,
      "requiresContext": false,
      "example": {
        "type": "minimal",
        "code": null // generowane automatycznie
      },
      "props": { /* ... */ }
    },
    "PasswordInput": {
      "import": "@fragment_ui/ui/input",
      "type": "alias",
      "aliasFor": "Input",
      "aliasProps": {
        "type": "password"
      },
      "requiresContext": false
    }
  },
  "aliases": {
    "Alert": "AlertDialog",
    "Form": "FormEnhanced"
  }
}
```

### 2. **Component Code Generator - Warstwa Abstrakcji**

```typescript
// apps/demo/lib/component-code-generator.ts

interface ComponentMetadata {
  name: string;
  actualName: string;
  type: 'simple' | 'compound' | 'alias';
  requiresSubcomponents?: string[];
  requiresContext?: boolean;
  selfClosing?: boolean;
  aliasProps?: Record<string, any>;
  example?: {
    type: 'minimal' | 'full' | 'interactive';
    code?: string;
  };
  props?: Record<string, any>;
}

class ComponentCodeGenerator {
  constructor(private registry: Registry) {}

  /**
   * Główna metoda generująca kod komponentu
   */
  async generateCode(componentName: string): Promise<string> {
    // 1. Rozwiąż aliasy
    const metadata = this.resolveComponent(componentName);
    
    // 2. Waliduj komponent
    this.validateComponent(metadata);
    
    // 3. Wygeneruj kod w zależności od typu
    switch (metadata.type) {
      case 'simple':
        return this.generateSimpleComponent(metadata);
      case 'compound':
        return this.generateCompoundComponent(metadata);
      case 'alias':
        return this.generateAliasComponent(metadata);
      default:
        throw new Error(`Unknown component type: ${metadata.type}`);
    }
  }

  /**
   * Rozwiązuje aliasy i zwraca pełne metadane komponentu
   */
  private resolveComponent(componentName: string): ComponentMetadata {
    // Sprawdź aliasy
    const actualName = this.registry.aliases?.[componentName] || componentName;
    
    // Pobierz metadane z registry
    const componentInfo = this.registry.components[actualName];
    if (!componentInfo) {
      throw new ComponentNotFoundError(componentName, actualName);
    }

    return {
      name: componentName,
      actualName,
      type: componentInfo.type || 'simple',
      requiresSubcomponents: componentInfo.requiresSubcomponents,
      requiresContext: componentInfo.requiresContext || false,
      selfClosing: componentInfo.selfClosing || false,
      aliasProps: componentInfo.aliasProps,
      example: componentInfo.example,
      props: componentInfo.props
    };
  }

  /**
   * Waliduje komponent przed generowaniem kodu
   */
  private validateComponent(metadata: ComponentMetadata): void {
    // Sprawdź, czy komponent istnieje w eksportach @fragment_ui/ui
    // (można to zrobić przez dynamiczny import w dev mode)
    
    // Sprawdź, czy wymagane podkomponenty istnieją
    if (metadata.requiresSubcomponents) {
      for (const subcomponent of metadata.requiresSubcomponents) {
        if (!this.registry.components[subcomponent]) {
          throw new SubcomponentNotFoundError(subcomponent, metadata.name);
        }
      }
    }

    // Sprawdź, czy komponenty z Context mają odpowiednie przykłady
    if (metadata.requiresContext && !metadata.example?.code) {
      console.warn(
        `Component ${metadata.name} requires Context but has no pre-generated example. ` +
        `This may cause rendering issues in iframe.`
      );
    }
  }

  /**
   * Generuje kod dla prostego komponentu
   */
  private generateSimpleComponent(metadata: ComponentMetadata): string {
    const imports = this.generateImports(metadata);
    const componentCode = this.generateComponentJSX(metadata);
    
    return `${imports}\n\nexport default function ${metadata.name}Example() {\n  return (\n    ${componentCode}\n  );\n}`;
  }

  /**
   * Generuje kod dla złożonego komponentu (np. AlertDialog)
   */
  private generateCompoundComponent(metadata: ComponentMetadata): string {
    // Jeśli jest pre-generated example, użyj go
    if (metadata.example?.code) {
      return metadata.example.code;
    }

    // W przeciwnym razie wygeneruj pełny przykład
    const imports = this.generateImports(metadata, metadata.requiresSubcomponents);
    const componentCode = this.generateCompoundComponentJSX(metadata);
    
    return `${imports}\n\nexport default function ${metadata.name}Example() {\n  return (\n    ${componentCode}\n  );\n}`;
  }

  /**
   * Generuje kod dla aliasu (np. PasswordInput -> Input)
   */
  private generateAliasComponent(metadata: ComponentMetadata): string {
    const aliasFor = this.registry.components[metadata.actualName];
    const aliasMetadata: ComponentMetadata = {
      ...metadata,
      type: aliasFor.type || 'simple',
      props: { ...aliasFor.props, ...metadata.aliasProps }
    };

    return this.generateSimpleComponent(aliasMetadata);
  }

  /**
   * Generuje import statements
   */
  private generateImports(
    metadata: ComponentMetadata,
    additionalComponents?: string[]
  ): string {
    const componentsToImport = [
      metadata.actualName,
      ...(additionalComponents || [])
    ].filter(Boolean);

    return `"use client";\nimport { ${componentsToImport.join(', ')} } from "@fragment_ui/ui";`;
  }

  /**
   * Generuje JSX dla prostego komponentu
   */
  private generateComponentJSX(metadata: ComponentMetadata): string {
    const props = this.generateProps(metadata.props);
    const tag = metadata.selfClosing 
      ? `<${metadata.actualName}${props} data-ui-id="${metadata.name.toLowerCase()}-example" />`
      : `<${metadata.actualName}${props} data-ui-id="${metadata.name.toLowerCase()}-example">\n      Example\n    </${metadata.actualName}>`;

    return tag;
  }

  /**
   * Generuje JSX dla złożonego komponentu
   */
  private generateCompoundComponentJSX(metadata: ComponentMetadata): string {
    // Template-based generation dla złożonych komponentów
    // Można użyć template strings lub plików szablonów
    if (metadata.actualName === 'AlertDialog') {
      return this.generateAlertDialogJSX();
    }
    
    // Domyślny template dla innych złożonych komponentów
    return this.generateDefaultCompoundJSX(metadata);
  }

  /**
   * Generuje props z metadanych
   */
  private generateProps(props?: Record<string, any>): string {
    if (!props) return '';
    
    const propsArray = Object.entries(props)
      .slice(0, 3) // Limit props dla prostoty
      .map(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return `${key}="${value[0]}"`;
        } else if (typeof value === 'string' && !value.includes('|')) {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean' && value) {
          return key;
        }
        return null;
      })
      .filter(Boolean);

    return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : '';
  }
}

// Custom Errors
class ComponentNotFoundError extends Error {
  constructor(public componentName: string, public actualName: string) {
    super(`Component "${componentName}" (alias for "${actualName}") not found in registry.`);
    this.name = 'ComponentNotFoundError';
  }
}

class SubcomponentNotFoundError extends Error {
  constructor(public subcomponent: string, public parentComponent: string) {
    super(`Subcomponent "${subcomponent}" required by "${parentComponent}" not found in registry.`);
    this.name = 'SubcomponentNotFoundError';
  }
}
```

### 3. **Component Renderer - Warstwa Renderowania**

```typescript
// apps/demo/lib/component-renderer.ts

interface RenderOptions {
  code: string;
  metadata: ComponentMetadata;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

class ComponentRenderer {
  constructor(
    private worker: Worker,
    private generator: ComponentCodeGenerator
  ) {}

  /**
   * Renderuje komponent z obsługą błędów i fallback
   */
  async render(componentName: string, options: RenderOptions): Promise<void> {
    try {
      // 1. Wygeneruj kod
      const code = await this.generator.generateCode(componentName);
      
      // 2. Sprawdź, czy komponent wymaga Context
      const metadata = this.generator.resolveComponent(componentName);
      if (metadata.requiresContext) {
        // Użyj specjalnego renderera dla komponentów z Context
        return this.renderWithContextSupport(code, metadata, options);
      }

      // 3. Renderuj normalnie
      return this.renderNormal(code, options);
    } catch (error) {
      if (error instanceof ComponentNotFoundError) {
        return this.renderFallback(
          `Component "${error.componentName}" not found.`,
          `Available components: ${this.getAvailableComponents().join(', ')}`,
          options
        );
      }
      
      if (error instanceof SubcomponentNotFoundError) {
        return this.renderFallback(
          `Subcomponent "${error.subcomponent}" not found.`,
          `Please add "${error.subcomponent}" to registry.`,
          options
        );
      }

      return this.renderFallback(
        'Failed to render component.',
        error.message,
        options
      );
    }
  }

  /**
   * Renderuje komponent z obsługą React Context
   */
  private async renderWithContextSupport(
    code: string,
    metadata: ComponentMetadata,
    options: RenderOptions
  ): Promise<void> {
    // Dla komponentów z Context, użyj pre-generated example
    // lub wrapper, który zapewnia Context Provider
    if (metadata.example?.code) {
      return this.renderNormal(metadata.example.code, options);
    }

    // W przeciwnym razie, wygeneruj wrapper z Provider
    const wrappedCode = this.wrapWithContextProvider(code, metadata);
    return this.renderNormal(wrappedCode, options);
  }

  /**
   * Opakowuje kod w Context Provider
   */
  private wrapWithContextProvider(code: string, metadata: ComponentMetadata): string {
    // Dla AlertDialog, użyj AlertDialogProvider jeśli istnieje
    // W przeciwnym razie, użyj domyślnego wrappera
    return `
"use client";
import React from "react";
${code}

// Wrapper zapewniający Context
export default function WrappedComponent() {
  return (
    <React.StrictMode>
      <AlertExample />
    </React.StrictMode>
  );
}`;
  }

  /**
   * Renderuje fallback z informacją o błędzie
   */
  private renderFallback(
    title: string,
    message: string,
    options: RenderOptions
  ): void {
    const fallbackCode = `
"use client";
import React from "react";

export default function ComponentError() {
  return (
    <div style={{
      padding: "2rem",
      textAlign: "center",
      color: "var(--foreground-primary)"
    }}>
      <h3 style={{ marginBottom: "1rem" }}>${title}</h3>
      <p style={{ color: "var(--foreground-secondary)" }}>${message}</p>
    </div>
  );
}`;

    this.renderNormal(fallbackCode, options);
  }
}
```

### 4. **Component Registry Validator**

```typescript
// apps/demo/lib/registry-validator.ts

class RegistryValidator {
  /**
   * Waliduje registry przed użyciem
   */
  async validateRegistry(registry: Registry): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Sprawdź aliasy
    for (const [alias, actualName] of Object.entries(registry.aliases || {})) {
      if (!registry.components[actualName]) {
        errors.push(`Alias "${alias}" points to non-existent component "${actualName}"`);
      }
    }

    // 2. Sprawdź komponenty
    for (const [name, component] of Object.entries(registry.components)) {
      // Sprawdź, czy wymagane podkomponenty istnieją
      if (component.requiresSubcomponents) {
        for (const subcomponent of component.requiresSubcomponents) {
          if (!registry.components[subcomponent]) {
            errors.push(
              `Component "${name}" requires subcomponent "${subcomponent}" which doesn't exist`
            );
          }
        }
      }

      // Sprawdź, czy komponenty z Context mają przykłady
      if (component.requiresContext && !component.example?.code) {
        warnings.push(
          `Component "${name}" requires Context but has no pre-generated example. ` +
          `This may cause rendering issues.`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Sprawdza, czy komponent jest eksportowany z @fragment_ui/ui
   */
  async validateExports(componentName: string): Promise<boolean> {
    try {
      // W dev mode, można użyć dynamicznego importu
      if (process.env.NODE_ENV === 'development') {
        const module = await import('@fragment_ui/ui');
        return componentName in module;
      }
      return true; // W production, zakładamy że wszystko jest OK
    } catch {
      return false;
    }
  }
}
```

### 5. **Pre-generated Component Examples**

```typescript
// apps/demo/registry/examples/alert-dialog.example.tsx

/**
 * Pre-generated example for AlertDialog component
 * This ensures proper Context support and avoids runtime errors
 */
export const alertDialogExample = `
"use client";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export default function AlertExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Open Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`;
```

---

## 🔄 Migracja i Implementacja

### Faza 1: Rozszerzenie Registry
1. Dodaj rozszerzone metadane do `registry.json`
2. Dodaj pre-generated examples dla komponentów z Context
3. Dodaj walidację registry przy starcie aplikacji

### Faza 2: Implementacja Generatora
1. Stwórz `ComponentCodeGenerator` class
2. Zastąp hardcoded logikę w `page.tsx` wywołaniami generatora
3. Dodaj testy jednostkowe dla generatora

### Faza 3: Implementacja Renderera
1. Stwórz `ComponentRenderer` class
2. Dodaj obsługę fallback dla błędów
3. Dodaj specjalną obsługę dla komponentów z Context

### Faza 4: Walidacja i Testy
1. Dodaj `RegistryValidator`
2. Dodaj testy E2E dla wszystkich komponentów
3. Dodaj monitoring błędów renderowania

---

## ✅ Korzyści

1. **Skalowalność:** Nowe komponenty dodawane przez rozszerzenie registry, bez zmian w kodzie
2. **Stabilność:** Walidacja przed renderowaniem, fallback dla błędów
3. **Utrzymywalność:** Centralna logika, łatwe do debugowania
4. **Type Safety:** TypeScript interfaces dla metadanych
5. **Developer Experience:** Jasne komunikaty błędów, sugestie rozwiązań

---

## 📝 Przykład Użycia

```typescript
// apps/demo/app/playground/page.tsx

const generator = new ComponentCodeGenerator(registry);
const renderer = new ComponentRenderer(worker, generator);

onComponentSelect={async (componentName) => {
  try {
    await renderer.render(componentName, {
      code: '',
      metadata: generator.resolveComponent(componentName),
      onError: (error) => {
        toast.error(`Failed to render: ${error.message}`);
      },
      onSuccess: () => {
        toast.success(`Component ${componentName} rendered successfully`);
      }
    });
  } catch (error) {
    console.error('Component render error:', error);
  }
}}
```

---

## 🎯 Następne Kroki

1. **Zaprojektuj szczegółową strukturę registry** z wszystkimi komponentami
2. **Stwórz pre-generated examples** dla komponentów z Context
3. **Zaimplementuj ComponentCodeGenerator** z testami
4. **Zaimplementuj ComponentRenderer** z fallback systemem
5. **Dodaj RegistryValidator** z automatycznymi testami
6. **Migruj istniejące komponenty** do nowego systemu
7. **Dodaj dokumentację** dla deweloperów dodających nowe komponenty

