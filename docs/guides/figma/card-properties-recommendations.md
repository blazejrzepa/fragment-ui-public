# Rekomendacje właściwości Figma dla komponentu Card

## 📋 Przegląd komponentu

Komponent `Card` to kontener do wyświetlania treści w zamkniętym boxie. Składa się z:
- **Card** (główny kontener)
- **CardHeader** (nagłówek z paddingiem)
- **CardTitle** (tytuł karty)
- **CardDescription** (opis karty)
- **CardContent** (główna treść)
- **CardFooter** (stopka z akcjami)

## 🎨 Właściwości Figma dla głównego komponentu Card

### **Card (główny kontener)**

#### **Display & Layout**
```
display: inline-flex
flex-direction: column
align-items: flex-start
```

#### **Padding**
```
Padding: var(--space-6) /* 24px */
Token: --space-6 (24px)
```

#### **Background**
```
Light theme:
  Fill: var(--background-secondary) = #f4f4f5 (lub token Background / Secondary)

Dark theme:
  Fill: var(--background-secondary) = #18181B (lub token Background / Secondary)
```

#### **Border Radius**
```
Border Radius: 20px
Token: Radius / xl (lub Corner-Radius-xl)
```

#### **Text Color**
```
Light theme:
  Color: var(--foreground-primary) = #0a0a0a (lub token Foreground / Primary)

Dark theme:
  Color: var(--foreground-primary) = #FAFAFA (lub token Foreground / Primary)
```

**Uwaga:** Card nie ma już box-shadow.

---

## 📦 Sub-komponenty

### **CardHeader**

#### **Layout**
```
display: flex
flex-direction: column
align-items: flex-start
gap: 6px (space-y-1.5 = 0.375rem)
```

#### **Padding**
```
Padding: 0px (padding jest teraz w głównym Card)
```

---

### **CardTitle (Headline)**

#### **Typography**
```
Font Family: Geist
Font Size: 24px (Display xs)
Font Weight: 600 (Semibold)
Line Height: 110% (26.4px)
Font Style: normal
```

#### **Color**
```
Light theme:
  Color: var(--foreground-primary) = #0a0a0a

Dark theme:
  Color: var(--foreground-primary) = #FAFAFA
```

#### **HTML Tag**
```
Tag: <h3>
```

---

### **CardDescription (Support text)**

#### **Typography**
```
Font Family: Geist
Font Size: 16px (Text md)
Font Weight: 400 (Regular)
Line Height: 160% (25.6px)
Font Style: normal
```

#### **Color**
```
Light theme:
  Color: var(--foreground-secondary) = #737373

Dark theme:
  Color: var(--foreground-secondary) = #71717A
```

#### **HTML Tag**
```
Tag: <p>
```

---

### **CardContent (Body text)**

#### **Typography**
```
Font Family: Geist
Font Size: 16px (Text md)
Font Weight: 400 (Regular)
Line Height: 160% (25.6px)
Font Style: normal
```

#### **Color**
```
Light theme:
  Color: var(--foreground-primary) = #0a0a0a

Dark theme:
  Color: var(--foreground-primary) = #FAFAFA
```

#### **Padding**
```
Padding: 0px (padding jest teraz w głównym Card)
```

---

### **CardFooter**

#### **Layout**
```
display: flex
align-items: center
```

#### **Padding**
```
Padding: 0px (padding jest teraz w głównym Card)
```

---

## 🎯 Warianty w Figma

### **Rekomendowane Variant Properties:**

1. **Has Header** (Boolean)
   - `true` - Card ma CardHeader
   - `false` - Card nie ma CardHeader

2. **Has Footer** (Boolean)
   - `true` - Card ma CardFooter
   - `false` - Card nie ma CardFooter

3. **Has Description** (Boolean)
   - `true` - CardHeader zawiera CardDescription
   - `false` - CardHeader zawiera tylko CardTitle

### **Przykładowe kombinacje:**

| Has Header | Has Footer | Has Description | Opis |
|------------|------------|-----------------|------|
| ✅ | ✅ | ✅ | Pełna karta z wszystkimi elementami |
| ✅ | ✅ | ❌ | Karta z tytułem i stopką, bez opisu |
| ✅ | ❌ | ✅ | Karta z nagłówkiem i treścią, bez stopki |
| ✅ | ❌ | ❌ | Karta z tylko tytułem i treścią |
| ❌ | ✅ | - | Karta bez nagłówka, tylko treść i stopka |
| ❌ | ❌ | - | Minimalna karta z tylko treścią |

**Łącznie: 6 wariantów**

---

## 📐 Struktura w Figma

### **Komponenty do utworzenia:**

1. **Card** (główny komponent)
   - Auto Layout: Vertical
   - Padding: 24px (wszystkie strony)
   - Background: `Background / Secondary`
   - Border Radius: 20px (lub `Radius / xl`)
   - Display: inline-flex
   - Align Items: flex-start

2. **CardHeader** (sub-komponent)
   - Auto Layout: Vertical
   - Padding: 0px (padding jest w głównym Card)
   - Gap: 6px
   - Opcjonalny (może być ukryty)

3. **CardTitle** (sub-komponent w CardHeader - Headline)
   - Text Style: Display xs / Semibold (24px, 600, 110% line-height)
   - Color: `Foreground / Primary`

4. **CardDescription** (sub-komponent w CardHeader - Support text)
   - Text Style: Text md / Regular (16px, 400, 160% line-height)
   - Color: `Foreground / Secondary`
   - Opcjonalny (może być ukryty)

5. **CardContent** (sub-komponent - Body text)
   - Padding: 0px (padding jest w głównym Card)
   - Text Style: Text md / Regular (16px, 400, 160% line-height)
   - Color: `Foreground / Primary`
   - Zawiera główną treść

6. **CardFooter** (sub-komponent)
   - Auto Layout: Horizontal
   - Padding: 0px (padding jest w głównym Card)
   - Align Items: Center
   - Opcjonalny (może być ukryty)

---

## 🎨 Style z kodu (dla referencji)

### **Card (główny kontener)**
```css
display: inline-flex;
flex-direction: column;
align-items: flex-start;
padding: var(--space-6); /* 24px */
border-radius: 20px;
background: var(--background-secondary, #18181B);
color: var(--foreground-primary, #FAFAFA);
```

### **CardHeader**
```css
display: flex;
flex-direction: column;
gap: 6px; /* space-y-1.5 */
padding: 0px; /* padding jest w głównym Card */
```

### **CardTitle (Headline)**
```css
font-family: Geist, sans-serif;
font-size: 24px; /* Display xs */
font-weight: 600; /* semibold */
line-height: 110%; /* 26.4px */
font-style: normal;
color: var(--foreground-primary, #FAFAFA);
```

### **CardDescription (Support text)**
```css
font-family: Geist, sans-serif;
font-size: 16px; /* Text md */
font-weight: 400; /* regular */
line-height: 160%; /* 25.6px */
font-style: normal;
color: var(--foreground-secondary, #71717A);
```

### **CardContent (Body text)**
```css
font-family: Geist, sans-serif;
font-size: 16px; /* Text md */
font-weight: 400; /* regular */
line-height: 160%; /* 25.6px */
font-style: normal;
color: var(--foreground-primary, #FAFAFA);
padding: 0px; /* padding jest w głównym Card */
```

### **CardFooter**
```css
display: flex;
align-items: center;
padding: 0px; /* padding jest w głównym Card */
```

---

## ✅ Checklist implementacji w Figma

- [ ] Utworzyć główny komponent **Card** z właściwym background, border-radius i shadow
- [ ] Utworzyć sub-komponenty: **CardHeader**, **CardTitle**, **CardDescription**, **CardContent**, **CardFooter**
- [ ] Ustawić Variant Properties: `Has Header`, `Has Footer`, `Has Description`
- [ ] Utworzyć wszystkie 6 wariantów
- [ ] Użyć tokenów kolorów zamiast hardcoded wartości
- [ ] Użyć tokenów spacing dla padding i gap
- [ ] Użyć tokenów radius dla border-radius
- [ ] Użyć tokenów typography dla font sizes i weights
- [ ] Przetestować wszystkie warianty w light i dark mode
- [ ] Dodać Dev Resources (linki do kodu, docs, Storybook)

---

## 🔗 Linki

- **Kod:** `packages/ui/src/card.tsx`
- **Dokumentacja:** `apps/www/app/docs/components/card/page.tsx`
- **Storybook:** `/docs/display-card--docs`
- **Testy:** `packages/ui/src/card.test.tsx`

---

## 💡 Uwagi

1. **Card nie ma border ani shadow** - używamy tylko background dla separacji
2. **Padding jest w głównym Card** - wszystkie sub-komponenty mają padding 0px
3. **CardTitle używa Display xs** - większy font (24px) z line-height 110% dla lepszej czytelności nagłówków
4. **CardDescription i CardContent używają Text md** - jednolity rozmiar (16px) z line-height 160% dla lepszej czytelności
5. **Border radius to 20px** - większy niż wcześniej (16px) dla bardziej zaokrąglonych rogów
6. **Background używa `--background-secondary`** - zamiast `--color-surface-1` dla lepszej separacji wizualnej

