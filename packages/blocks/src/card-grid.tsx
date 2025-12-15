import { Button } from "@fragment_ui/ui";

interface Card {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface CardGridProps {
  title?: string;
  cards?: Card[];
  columns?: 1 | 2 | 3 | 4;
}

export function CardGrid({
  title,
  cards,
  columns = 3,
}: CardGridProps) {
  const defaultCards: Card[] = [
    {
      title: "Card 1",
      description: "This is a sample card with some description text.",
      action: { label: "Learn More" },
    },
    {
      title: "Card 2",
      description: "Another card with different content.",
      action: { label: "View Details" },
    },
    {
      title: "Card 3",
      description: "Third card in the grid layout.",
      action: { label: "Explore" },
    },
  ];

  const displayCards = cards || defaultCards;
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {displayCards.map((card, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)] hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            {card.description && (
              <p className="text-[color:var(--color-fg-muted)] mb-4">
                {card.description}
              </p>
            )}
            {card.action && (
              card.action.href ? (
                <a href={card.action.href}>
                  <Button variant="outline" size="sm">
                    {card.action.label}
                  </Button>
                </a>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={card.action.onClick}
                >
                  {card.action.label}
                </Button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

