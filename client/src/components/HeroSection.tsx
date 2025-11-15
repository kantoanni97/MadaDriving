import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@assets/generated_images/Madagascar_coastal_highway_hero_9acb5798.png";
import { GraduationCap } from "lucide-react";

interface HeroSectionProps {
  onStartLearning: () => void;
}

export default function HeroSection({ onStartLearning }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="relative h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>

      <div className="relative container mx-auto flex h-full items-center px-4">
        <div className="max-w-2xl text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl" data-testid="text-hero-title">
            {t("home.title")}
          </h1>
          <p className="mb-8 text-lg text-white/90" data-testid="text-hero-subtitle">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="default"
              onClick={onStartLearning}
              data-testid="button-start-learning"
              className="bg-primary/90 backdrop-blur hover:bg-primary"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              {t("home.startLearning")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}