import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;          // 0–5
  size?: "sm" | "md" | "lg";
  className?: string;      // por si quieres agregar estilos extra
}

export function RatingStars({ rating, size = "sm", className }: RatingStarsProps) {
  const baseSize =
    size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;

        return (
          <Star
            key={starNumber}
            className={`${baseSize} ${
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        );
      })}
    </div>
  );
}
