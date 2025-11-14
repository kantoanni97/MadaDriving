import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import { CarFront, CircleAlert, ParkingCircle, SignpostBig, ShieldCheck, Navigation } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Mock categories - todo: remove mock functionality
  const categories = [
    {
      id: "roadSigns",
      icon: SignpostBig,
      title: t("category.roadSigns"),
      lessonCount: 12,
      questionCount: 45,
    },
    {
      id: "traffic",
      icon: CircleAlert,
      title: t("category.traffic"),
      lessonCount: 8,
      questionCount: 32,
    },
    {
      id: "safety",
      icon: ShieldCheck,
      title: t("category.safety"),
      lessonCount: 10,
      questionCount: 28,
    },
    {
      id: "vehicle",
      icon: CarFront,
      title: t("category.vehicle"),
      lessonCount: 6,
      questionCount: 20,
    },
    {
      id: "priority",
      icon: Navigation,
      title: t("category.priority"),
      lessonCount: 7,
      questionCount: 25,
    },
    {
      id: "parking",
      icon: ParkingCircle,
      title: t("category.parking"),
      lessonCount: 5,
      questionCount: 18,
    },
  ];

  return (
    <div>
      <HeroSection
        onStartLearning={() => setLocation("/category/roadSigns")}
        onAdminLogin={() => setLocation("/admin")}
      />

      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold" data-testid="text-categories-title">
          {t("home.categories")}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              lessonCount={category.lessonCount}
              questionCount={category.questionCount}
              onClick={() => setLocation(`/category/${category.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
