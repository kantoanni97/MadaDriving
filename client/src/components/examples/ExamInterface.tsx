import { LanguageProvider } from "@/contexts/LanguageContext";
import ExamInterface from "../ExamInterface";
import roadSignsImage from "@assets/generated_images/Road_signs_collection_b6d31949.png";
import dashboardImage from "@assets/generated_images/Car_dashboard_controls_diagram_caab3a6f.png";

export default function ExamInterfaceExample() {
  const mockQuestions = [
    {
      id: "1",
      question: "Que signifie un panneau octogonal rouge avec STOP écrit en blanc?",
      imageUrl: roadSignsImage,
      options: [
        "Ralentir et céder le passage si nécessaire",
        "Arrêt obligatoire avant la ligne",
        "Interdiction de s'arrêter",
        "Sens interdit",
      ],
      correctAnswer: 1,
    },
    {
      id: "2",
      question: "Quelle est la fonction des feux de détresse?",
      imageUrl: dashboardImage,
      options: [
        "Signaler un danger ou une panne",
        "Éclairer la route la nuit",
        "Indiquer un changement de direction",
        "Activer les essuie-glaces",
      ],
      correctAnswer: 0,
    },
    {
      id: "3",
      question: "À quelle vitesse maximale pouvez-vous rouler en agglomération?",
      options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
      correctAnswer: 1,
    },
  ];

  return (
    <LanguageProvider>
      <ExamInterface
        questions={mockQuestions}
        onComplete={(answers) => console.log("Exam completed with answers:", answers)}
        onExit={() => console.log("Exit exam")}
        timeLimit={600}
      />
    </LanguageProvider>
  );
}
