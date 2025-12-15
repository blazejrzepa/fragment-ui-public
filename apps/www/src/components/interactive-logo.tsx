"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { useTheme } from "../lib/theme";

export interface InteractiveLogoProps {
  size?: number;
  gap?: number;
  color?: string;
  accentColor?: string;
  className?: string;
}

export function InteractiveLogo({
  size,
  gap,
  color,
  accentColor,
  className = "",
}: InteractiveLogoProps) {
  const { effectiveTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use DS spacing tokens where possible
  // Note: For precise logo sizing, we use custom values (9px, 3px) that don't align with DS scale
  // DS spacing scale: 0, 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px)
  // Custom values are acceptable for logo-specific sizing requirements
  const boxSize = size ?? 9; // Custom: slightly smaller than --space-2 (8px) for precise logo sizing
  const boxGap = gap ?? 3; // Custom: slightly smaller than --space-1 (4px) for tighter spacing
  
  // Ensure total height is 21px (9*2 + 3)
  const totalHeight = boxSize * 2 + boxGap;
  
  // Scale factor to make animation smaller (0.83 = 83% = ~17px)
  const scaleFactor = 0.83; // Makes it ~17px (21px * 0.83 ≈ 17px)
  const scaledSize = totalHeight * scaleFactor;
  
  // Use DS color tokens - automatically changes with theme
  const defaultColor = color || "var(--foreground-primary)";
  const defaultAccentColor = accentColor || "var(--foreground-primary)";
  
  // Use DS spacing token for animation offset (4px = --space-1)
  const animationOffset = 4; // Matches --space-1 (4px) from DS

  // Obliczone pozycje dla siatki 2x2
  // Lewy Górny (0,0)
  // Lewy Dolny (0, size + gap)
  // Prawy Dolny (size + gap, size + gap)
  // Prawy Górny (size + gap, 0) -> TO JEST NASZ CEL DLA RUCHOMEGO ELEMENTU

  const targetX = boxSize + boxGap;
  const targetY = 0;

  return (
    <motion.svg
      // Ustawiamy wymiary tak, aby mieściły 2 boxy + odstęp
      // Całkowita wysokość skalowana przez scaleFactor
      width={scaledSize}
      height={scaledSize}
      viewBox={`0 0 ${totalHeight} ${totalHeight}`}
      
      // overflow-visible jest kluczowe! 
      // Pozwala animowanemu elementowi wystawać poza obrys SVG przed "wskoczeniem"
      className={`overflow-visible cursor-pointer ${className}`}
      
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* --- 3 STATYCZNE BOXY --- */}
      
      {/* Lewy Górny */}
      <rect x={0} y={0} width={boxSize} height={boxSize} rx="2" fill={defaultColor} />
      
      {/* Lewy Dolny */}
      <rect x={0} y={boxSize + boxGap} width={boxSize} height={boxSize} rx="2" fill={defaultColor} />
      
      {/* Prawy Dolny */}
      <rect x={boxSize + boxGap} y={boxSize + boxGap} width={boxSize} height={boxSize} rx="2" fill={defaultColor} />

      {/* --- 4. ANIMOWANY BOX (Prawy Górny) --- */}
      <motion.rect
        width={boxSize}
        height={boxSize}
        rx="2" // Border radius: custom 2px for small logo elements (DS --radius-sm is 8px, too large for 9px boxes)
        fill={defaultColor}
        
        // Ważne: ustawiamy origin na środek tego konkretnego kwadratu, 
        // żeby obracał się wokół własnej osi, a nie lewego górnego rogu.
        style={{ originX: 0.5, originY: 0.5 }}

        variants={{
          rest: {
            x: targetX + animationOffset, // Przesunięty o --space-1 (4px) w prawo (DS compliant)
            y: targetY - animationOffset, // Przesunięty o --space-1 (4px) w górę (DS compliant)
            rotate: 45,      // Obrócony o 45 stopni
            opacity: 0.4,    // Bardziej przezroczysty
            scale: 0.9,      // Troszkę mniejszy
          },
          hover: {
            x: targetX,      // Wskakuje idealnie na miejsce
            y: targetY,
            rotate: 0,       // Prostuje się
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring", // Fizyka sprężyny (Framer Motion specific - not available in DS motion tokens)
              // Note: Spring physics values (stiffness, damping, mass) are Framer Motion specific
              // DS motion tokens provide duration/easing but not spring physics parameters
              stiffness: 200, // Custom spring physics - not available in DS tokens
              damping: 15,    // Custom spring physics - not available in DS tokens
              mass: 1         // Custom spring physics - not available in DS tokens
            }
          }
        }}
      />
    </motion.svg>
  );
}

