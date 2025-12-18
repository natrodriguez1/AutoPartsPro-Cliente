import { CardDescription, CardTitle } from "@/shared/ui/card";

type Props = {
  title: string;
  description: string;
};

export function AuthSectionHeader({ title, description }: Props) {
  return (
    <div className="text-center mb-4">
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </div>
  );
}
