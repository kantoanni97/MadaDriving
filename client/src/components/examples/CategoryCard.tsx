import { LanguageProvider } from "@/contexts/LanguageContext";
import CategoryCard from "../CategoryCard";
import { CarFront, CircleAlert, ParkingCircle, SignpostBig, ShieldCheck, Navigation } from "lucide-react";

export default function CategoryCardExample() {
  return (
    <LanguageProvider>
      <div className="grid gap-6 p-8 md:grid-cols-2 lg:grid-cols-3">
        <CategoryCard
          icon={SignpostBig}
          title="Panneaux de Signalisation"
          lessonCount={12}
          questionCount={45}
          onClick={() => console.log("Road signs clicked")}
        />
        <CategoryCard
          icon={CircleAlert}
          title="Règles de Circulation"
          lessonCount={8}
          questionCount={32}
          onClick={() => console.log("Traffic rules clicked")}
        />
        <CategoryCard
          icon={ShieldCheck}
          title="Sécurité Routière"
          lessonCount={10}
          questionCount={28}
          onClick={() => console.log("Safety clicked")}
        />
        <CategoryCard
          icon={CarFront}
          title="Véhicule et Mécanique"
          lessonCount={6}
          questionCount={20}
          onClick={() => console.log("Vehicle clicked")}
        />
        <CategoryCard
          icon={Navigation}
          title="Priorités"
          lessonCount={7}
          questionCount={25}
          onClick={() => console.log("Priority clicked")}
        />
        <CategoryCard
          icon={ParkingCircle}
          title="Stationnement"
          lessonCount={5}
          questionCount={18}
          onClick={() => console.log("Parking clicked")}
        />
      </div>
    </LanguageProvider>
  );
}
