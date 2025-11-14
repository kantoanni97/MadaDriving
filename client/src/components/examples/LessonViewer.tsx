import { LanguageProvider } from "@/contexts/LanguageContext";
import LessonViewer from "../LessonViewer";
import intersectionImage from "@assets/generated_images/Four-way_intersection_diagram_c1ef561c.png";

export default function LessonViewerExample() {
  return (
    <LanguageProvider>
      <LessonViewer
        title="Les Feux de Signalisation"
        content="Les feux de signalisation sont des dispositifs lumineux permettant de réguler la circulation routière. Le feu rouge oblige l'arrêt complet avant la ligne d'arrêt. Le feu orange signifie que le feu va passer au rouge, vous devez vous arrêter sauf si vous êtes trop près pour le faire en toute sécurité. Le feu vert vous autorise à passer, mais vous devez toujours vérifier que la voie est libre avant de vous engager dans l'intersection."
        imageUrl={intersectionImage}
        onPrevious={() => console.log("Previous lesson")}
        onNext={() => console.log("Next lesson")}
        onBack={() => console.log("Back to categories")}
        hasPrevious={true}
        hasNext={true}
      />
    </LanguageProvider>
  );
}
