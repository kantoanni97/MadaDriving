import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import LessonViewer from "@/components/LessonViewer";
import { useLanguage } from "@/contexts/LanguageContext";
import intersectionImage from "@assets/generated_images/Four-way_intersection_diagram_c1ef561c.png";
import roadSignsImage from "@assets/generated_images/Road_signs_collection_b6d31949.png";
import overtakingImage from "@assets/generated_images/Safe_overtaking_scenario_1e2f5468.png";
import roundaboutImage from "@assets/generated_images/Roundabout_traffic_flow_f5106849.png";

export default function CategoryLessons() {
  const [, params] = useRoute("/category/:categoryId");
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Mock lessons - todo: remove mock functionality
  const mockLessons = {
    roadSigns: [
      {
        id: "1",
        title: language === "fr" ? "Les Panneaux de Danger" : "Famantarana Loza",
        content: language === "fr" 
          ? "Les panneaux de danger sont de forme triangulaire avec un bord rouge. Ils avertissent les conducteurs d'un danger potentiel à venir. Il est important de ralentir et d'être vigilant lorsque vous voyez ces panneaux."
          : "Ny famantarana loza dia telozoro miaraka amin'ny sisiny mena. Mampitandrina ny mpamily fa misy loza mety hitranga. Zava-dehibe ny mampihena ny hafainganam-pandeha sy mitandrina rehefa mahita ireo famantarana ireo.",
        imageUrl: roadSignsImage,
      },
      {
        id: "2",
        title: language === "fr" ? "Les Panneaux d'Interdiction" : "Famantarana Fandrarana",
        content: language === "fr"
          ? "Les panneaux d'interdiction sont circulaires avec un bord rouge et un fond blanc. Ils interdisent certaines actions. Le non-respect de ces panneaux peut entraîner des amendes ou des accidents."
          : "Ny famantarana fandrarana dia boribory miaraka amin'ny sisiny mena sy fotsy. Mandrara asa sasany. Ny tsy fanajana ireo famantarana ireo dia mety hiteraka sazy na lozam-pifamoivoizana.",
        imageUrl: roadSignsImage,
      },
    ],
    traffic: [
      {
        id: "1",
        title: language === "fr" ? "Les Feux de Signalisation" : "Jiro Famantarana",
        content: language === "fr"
          ? "Les feux de signalisation régulent la circulation aux intersections. Le feu rouge oblige l'arrêt complet. Le feu orange signifie préparer l'arrêt. Le feu vert autorise le passage après vérification."
          : "Ny jiro famantarana dia mifehy ny fifamoivoizana eny an-tsampanan-dalana. Ny jiro mena dia manery ny fijanonana tanteraka. Ny jiro volomboasary dia midika hoe miomàna hijanona. Ny jiro maitso dia mamela ny fandehanana rehefa avy nanamarina.",
        imageUrl: intersectionImage,
      },
      {
        id: "2",
        title: language === "fr" ? "Le Dépassement Sécurisé" : "Fandalo Azo Antoka",
        content: language === "fr"
          ? "Le dépassement doit être effectué uniquement lorsque c'est sûr et autorisé. Vérifiez les rétroviseurs, signalez votre intention, assurez-vous d'avoir une visibilité suffisante et une distance adéquate."
          : "Ny fandalo dia tokony hatao rehefa azo antoka sy ekena ihany. Hamarino ny fitaratra, ambaro ny fikasanao, ataovy azo antoka fa mahita tsara ianao ary misy elanelana ampy.",
        imageUrl: overtakingImage,
      },
    ],
    safety: [
      {
        id: "1",
        title: language === "fr" ? "La Ceinture de Sécurité" : "Fehikibo Fiarovana",
        content: language === "fr"
          ? "Le port de la ceinture de sécurité est obligatoire pour tous les occupants du véhicule. Elle réduit considérablement les risques de blessures graves en cas d'accident. Attachez toujours votre ceinture avant de démarrer."
          : "Ny fanaovana fehikibo fiarovana dia tsy maintsy atao ho an'ny mpitaingina rehetra. Mampihena be ny loza amin'ny ratra lehibe raha sendra loza. Fehezina foana ny fehikibonao alohan'ny handeha.",
        imageUrl: undefined,
      },
    ],
    vehicle: [
      {
        id: "1",
        title: language === "fr" ? "Les Contrôles du Tableau de Bord" : "Ny Fitantanana ny Tableau de Bord",
        content: language === "fr"
          ? "Le tableau de bord contient des commandes essentielles: les clignotants pour signaler les changements de direction, les feux de détresse pour les situations d'urgence, et les commandes d'éclairage pour la visibilité nocturne."
          : "Ny tableau de bord dia ahitana baiko ilaina: ny jiro mpanondro ho fanovana lalana, ny jiro loza ho an'ny toe-javatra maika, ary ny baikon'ny jiro ho fahitana amin'ny alina.",
        imageUrl: undefined,
      },
    ],
    priority: [
      {
        id: "1",
        title: language === "fr" ? "Priorité aux Ronds-Points" : "Laharam-pahamehana amin'ny Rond-Point",
        content: language === "fr"
          ? "Dans un rond-point, les véhicules déjà engagés ont la priorité. Cédez le passage aux véhicules venant de votre gauche. Signalez votre sortie avec le clignotant droit."
          : "Ao amin'ny rond-point, ny fiara efa miditra dia manana ny laharam-pahamehana. Omeo lalana ny fiara avy any ankavia. Ambaro ny fivoahanao amin'ny jiro mpanondro havanana.",
        imageUrl: roundaboutImage,
      },
    ],
    parking: [
      {
        id: "1",
        title: language === "fr" ? "Le Stationnement Autorisé" : "Fijanonana Ekena",
        content: language === "fr"
          ? "Le stationnement est autorisé uniquement dans les zones prévues à cet effet. Respectez les marquages au sol et les panneaux. Ne bloquez jamais les passages piétons, les entrées ou les bouches d'incendie."
          : "Ny fijanonana dia ekena amin'ny toerana natokana ho an'izany ihany. Hajao ny famantarana amin'ny tany sy ny famantarana. Aza manakana ny lalan'ny mpandeha an-tongotra, ny fidirana, na ny loharanom-pamonoana afo.",
        imageUrl: undefined,
      },
    ],
  };

  const categoryId = params?.categoryId || "roadSigns";
  const lessons = mockLessons[categoryId as keyof typeof mockLessons] || mockLessons.roadSigns;
  const currentLesson = lessons[currentLessonIndex];

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      setLocation(`/exam/${categoryId}`);
    }
  };

  return (
    <LessonViewer
      title={currentLesson.title}
      content={currentLesson.content}
      imageUrl={currentLesson.imageUrl}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onBack={() => setLocation("/")}
      hasPrevious={currentLessonIndex > 0}
      hasNext={currentLessonIndex < lessons.length - 1}
    />
  );
}
