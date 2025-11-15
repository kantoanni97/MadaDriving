import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import { CarFront, CircleAlert, ParkingCircle, SignpostBig, ShieldCheck, Navigation, GraduationCap } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react"; // ← Ajoutez useEffect si pas déjà importé

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
  const { user } = useAuth(); // ← Ajoutez ceci

  // Rediriger les admins vers leur dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      setLocation("/admin-dashboard");
    }
  }, [user, setLocation]);

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
/>

      {/* Section Examen Blanc */}
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full">
                <GraduationCap className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {language === "fr" ? "Examen Blanc" : "Fanadinana Blancs"}
                </h3>
                <p className="text-white/90">
                  {language === "fr"
                    ? "40 questions aléatoires - Toutes catégories confondues"
                    : "Fanontaniana 40 kisendrasendra - Sokajy rehetra"}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setLocation("/exam-blanc")}
              className="whitespace-nowrap"
            >
              {language === "fr" ? "Commencer l'examen" : "Manomboka ny fanadinana"}
            </Button>
          </div>
        </Card>
      </div>

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