import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  lessonCount: number;
  questionCount: number;
  onClick: () => void;
}

export default function CategoryCard({
  icon: Icon,
  title,
  lessonCount,
  questionCount,
  onClick,
}: CategoryCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      className="cursor-pointer transition-all hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-category-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold" data-testid={`text-category-title-${title.toLowerCase()}`}>
            {title}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge variant="secondary" data-testid={`badge-lesson-count-${title.toLowerCase()}`}>
            {lessonCount} {t("category.lessons")}
          </Badge>
          <Badge variant="secondary" data-testid={`badge-question-count-${title.toLowerCase()}`}>
            {questionCount} {t("category.questions")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
