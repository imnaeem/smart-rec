import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBgColor = "bg-purple-100",
  iconColor = "text-purple-600",
}: FeatureCardProps) {
  return (
    <Card className="group relative h-full overflow-hidden border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-6 sm:p-8 h-full flex flex-col">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${iconBgColor} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconColor}`} />
        </div>
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 flex-shrink-0">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed text-sm sm:text-base flex-grow">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
