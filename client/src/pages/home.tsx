import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import { CarFront, CircleAlert, ParkingCircle, SignpostBig, ShieldCheck, Navigation } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryWithStats {
  id: string;
  nameFr: string;
  nameMg: string;
  icon: string;
  lessonCount: number;
  questionCount: number;
}

const iconMap: Record<string, any> = {
  SignpostBig,
  CircleAlert,
  ShieldCheck,
  CarFront,
  Navigation,
  ParkingCircle,
};

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: categories, isLoading } = useQuery<CategoryWithStats[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div>
      <HeroSection
        onStartLearning={() => {
          if (categories && categories.length > 0) {
            setLocation(`/category/${categories[0].id}`);
          }
        }}
        onAdminLogin={() => setLocation("/admin")}
      />

      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold" data-testid="text-categories-title">
          {t("home.categories")}
        </h2>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                icon={iconMap[category.icon] || SignpostBig}
                title={language === "fr" ? category.nameFr : category.nameMg}
                lessonCount={category.lessonCount}
                questionCount={category.questionCount}
                onClick={() => setLocation(`/category/${category.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
