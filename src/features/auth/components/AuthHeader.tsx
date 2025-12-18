import { Car } from "lucide-react";

export function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
        <Car className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">AutoParts Pro</h1>
      <p className="text-muted-foreground mt-2">
        Tu tienda de repuestos automotrices en Ecuador
      </p>
    </div>
  );
}
