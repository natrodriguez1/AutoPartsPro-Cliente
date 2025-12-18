import { Check } from "lucide-react";

type Props = {
  currentStep: number; // 1..4
};

export function CheckoutStepsIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-muted text-muted-foreground"
              }`}
            >
              {step < currentStep ? <Check className="h-5 w-5" /> : step}
            </div>

            {step < 4 && (
              <div
                className={`w-16 h-0.5 ml-4 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
