import { LanguageProvider } from "@/contexts/LanguageContext";
import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <LanguageProvider>
      <HeroSection
        onStartLearning={() => console.log("Start learning clicked")}
        onAdminLogin={() => console.log("Admin login clicked")}
      />
    </LanguageProvider>
  );
}
