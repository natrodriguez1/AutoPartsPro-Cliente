import { ImageWithFallback } from "@/shared/components/ImageWithFallback";

type Props = {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  alt: string;
};

export function ImageGallery({ images, selectedIndex, onSelect, alt }: Props) {
  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <ImageWithFallback
          src={images[selectedIndex]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`aspect-square overflow-hidden rounded-md border-2 ${
              index === selectedIndex ? "border-primary" : "border-muted"
            }`}
          >
            <ImageWithFallback
              src={src}
              alt={`${alt} - imagen ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
