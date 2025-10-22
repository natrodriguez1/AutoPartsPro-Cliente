import * as React from "react";
import { Paperclip, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

interface ImageUploadButtonProps extends VariantProps<typeof buttonVariants> {
  onImageSelect?: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // en MB
  disabled?: boolean;
  className?: string;
  showFileName?: boolean;
}

export default function ImageUploadButton({
  variant = "outline",
  size = "default",
  onImageSelect,
  accept = "image/*",
  maxSize = 5,
  disabled = false,
  className,
  showFileName = true,
}: ImageUploadButtonProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      // Validar tamaño
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        alert(`La imagen excede el tamaño máximo de ${maxSize}MB`);
        return;
      }
      
      setSelectedFile(file);
      onImageSelect?.(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onImageSelect?.(null);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        <Paperclip className="size-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {showFileName && selectedFile && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
          <Paperclip className="size-3" />
          <span className="flex-1 truncate">{selectedFile.name}</span>
          <span className="text-xs">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </span>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="hover:text-destructive transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Ejemplo de uso
function ExampleUsage() {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    console.log("Archivo seleccionado:", file);
    
    // Aquí puedes hacer el upload a tu API
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      
      // fetch('/api/chat', {
      //   method: 'POST',
      //   body: formData
      // });
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Ejemplos de uso</h2>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Botón por defecto (1 imagen)</h3>
        <ImageUploadButton onImageSelect={handleImageSelect} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Variante ghost, tamaño pequeño</h3>
        <ImageUploadButton
          variant="ghost"
          size="sm"
          onImageSelect={handleImageSelect}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Solo icono</h3>
        <ImageUploadButton
          size="icon"
          onImageSelect={handleImageSelect}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Sin mostrar nombre de archivo</h3>
        <ImageUploadButton
          showFileName={false}
          onImageSelect={handleImageSelect}
        />
      </div>

      {selectedImage && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-sm font-medium">Imagen seleccionada:</p>
          <p className="text-xs text-muted-foreground">{selectedImage.name}</p>
        </div>
      )}
    </div>
  );
}