import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import { CarFront, CircleAlert, ParkingCircle, SignpostBig, ShieldCheck, Navigation, GraduationCap, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const { user } = useAuth();

  const { data: categories, isLoading } = useQuery<CategoryWithStats[]>({
    queryKey: ["/api/categories"],
  });

  // Rediriger les admins vers leur dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      setLocation("/admin-dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-900/5">
      <HeroSection
        onStartLearning={() => {
          if (categories && categories.length > 0) {
            setLocation(`/category/${categories[0].id}`);
          }
        }}
      />

      {/* Section Examen Blanc - Modernisée */}
      <div className="container mx-auto px-4 py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-900 p-1 shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <div className="relative bg-gradient-to-br from-primary-600/95 to-primary-900/95 rounded-xl p-8 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-white/10 backdrop-blur-sm p-5 rounded-full border border-white/20">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                    <span className="text-accent text-sm font-semibold uppercase tracking-wider">
                      {language === "fr" ? "Nouveau" : "Vaovao"}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {language === "fr" ? "Examen Blanc" : "Fanadinana Blancs"}
                  </h3>
                  <p className="text-white/90 text-lg">
                    {language === "fr"
                      ? "40 questions aléatoires • Toutes catégories • Conditions réelles"
                      : "Fanontaniana 40 kisendrasendra • Sokajy rehetra • Toe-javatra tena izy"}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/90 text-sm backdrop-blur-sm">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      {language === "fr" ? "70% pour réussir" : "70% mba hahomby"}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/90 text-sm backdrop-blur-sm">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      {language === "fr" ? "Correction détaillée" : "Fanitsiana feno"}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setLocation("/exam-blanc")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 whitespace-nowrap group"
              >
                {language === "fr" ? "Commencer maintenant" : "Manomboka izao"}
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Catégories - Modernisée */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">
            {t("home.categories")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === "fr"
              ? "Explorez nos catégories et commencez votre apprentissage du code de la route"
              : "Jereo ny sokajy ary atombohy ny fianaranao ny fitsipiky ny lalana"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="group relative overflow-hidden border-2 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 cursor-pointer bg-card/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    onClick={() => setLocation(`/category/${category.id}`)}
                    className="relative p-6"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                        <div className="relative p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg">
                        {(() => {
  const IconComponent = iconMap[category.icon] || SignpostBig;
  return <IconComponent className="h-8 w-8" />;
})()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition-colors">
                          {language === "fr" ? category.nameFr : category.nameMg}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                        <div className="text-2xl font-bold text-primary-600">{category.lessonCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {language === "fr" ? "Leçons" : "Lesona"}
                        </div>
                      </div>
                      <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                        <div className="text-2xl font-bold text-accent">{category.questionCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {language === "fr" ? "Questions" : "Fanontaniana"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                      {language === "fr" ? "Commencer →" : "Manomboka →"}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

          </div>
  );
}