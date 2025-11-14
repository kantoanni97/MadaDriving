import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import ExamInterface from "@/components/ExamInterface";
import ResultsPage from "@/components/ResultsPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import roadSignsImage from "@assets/generated_images/Road_signs_collection_b6d31949.png";
import dashboardImage from "@assets/generated_images/Car_dashboard_controls_diagram_caab3a6f.png";
import intersectionImage from "@assets/generated_images/Four-way_intersection_diagram_c1ef561c.png";

export default function Exam() {
  const [, params] = useRoute("/exam/:categoryId");
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const [examStarted, setExamStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock questions - todo: remove mock functionality
  const mockQuestions = {
    roadSigns: [
      {
        id: "1",
        question: language === "fr" 
          ? "Que signifie un panneau octogonal rouge avec STOP écrit en blanc?"
          : "Inona no dikan'ny famantarana octogonal mena misy STOP fotsy?",
        imageUrl: roadSignsImage,
        options: language === "fr"
          ? [
              "Ralentir et céder le passage si nécessaire",
              "Arrêt obligatoire avant la ligne",
              "Interdiction de s'arrêter",
              "Sens interdit",
            ]
          : [
              "Mampihena hafainganam-pandeha sy manome lalana raha ilaina",
              "Tsy maintsy mijanona alohan'ny tsipika",
              "Tsy mahazo mijanona",
              "Tsy mahazo miditra",
            ],
        correctAnswer: 1,
      },
      {
        id: "2",
        question: language === "fr"
          ? "Que signifie un panneau triangulaire avec un bord rouge?"
          : "Inona no dikan'ny famantarana telozoro misy sisiny mena?",
        imageUrl: roadSignsImage,
        options: language === "fr"
          ? [
              "Panneau de danger",
              "Panneau d'interdiction",
              "Panneau d'indication",
              "Panneau de priorité",
            ]
          : [
              "Famantarana loza",
              "Famantarana fandrarana",
              "Famantarana fampahalalana",
              "Famantarana laharam-pahamehana",
            ],
        correctAnswer: 0,
      },
      {
        id: "3",
        question: language === "fr"
          ? "Quelle est la vitesse maximale autorisée dans une zone scolaire?"
          : "Inona ny hafainganam-pandeha ambony indrindra ekena ao amin'ny faritra misy sekoly?",
        options: language === "fr"
          ? ["20 km/h", "30 km/h", "40 km/h", "50 km/h"]
          : ["20 km/h", "30 km/h", "40 km/h", "50 km/h"],
        correctAnswer: 1,
      },
    ],
    traffic: [
      {
        id: "1",
        question: language === "fr"
          ? "Que devez-vous faire à un feu orange?"
          : "Inona no tokony hataonao amin'ny jiro volomboasary?",
        imageUrl: intersectionImage,
        options: language === "fr"
          ? [
              "Accélérer pour passer rapidement",
              "S'arrêter si c'est sécuritaire",
              "Continuer normalement",
              "Klaxonner et continuer",
            ]
          : [
              "Manafaingana mba handalo haingana",
              "Mijanona raha azo antoka",
              "Mitohy toy ny mahazatra",
              "Manisy trompetra ary mitohy",
            ],
        correctAnswer: 1,
      },
      {
        id: "2",
        question: language === "fr"
          ? "Quelle est la fonction des feux de détresse?"
          : "Inona ny asan'ny jiro loza?",
        imageUrl: dashboardImage,
        options: language === "fr"
          ? [
              "Signaler un danger ou une panne",
              "Éclairer la route la nuit",
              "Indiquer un changement de direction",
              "Activer les essuie-glaces",
            ]
          : [
              "Mampahafantatra loza na fahapotehan'ny fiara",
              "Manazava ny lalana amin'ny alina",
              "Mampiseho fiovana lalana",
              "Mandefitra ny mpamafa rano",
            ],
        correctAnswer: 0,
      },
    ],
  };

  const categoryId = params?.categoryId || "roadSigns";
  const questions = mockQuestions[categoryId as keyof typeof mockQuestions] || mockQuestions.roadSigns;

  // Generate 10 questions by repeating if needed
  const examQuestions = [];
  for (let i = 0; i < 10; i++) {
    examQuestions.push({
      ...questions[i % questions.length],
      id: `${questions[i % questions.length].id}-${i}`,
    });
  }

  const handleComplete = (answers: number[]) => {
    setUserAnswers(answers);
    setShowResults(true);
  };

  const handleRetake = () => {
    setUserAnswers([]);
    setShowResults(false);
    setExamStarted(false);
  };

  if (showResults) {
    return (
      <ResultsPage
        questions={examQuestions}
        userAnswers={userAnswers}
        onRetake={handleRetake}
        onBackToLessons={() => setLocation(`/category/${categoryId}`)}
      />
    );
  }

  if (!examStarted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold" data-testid="text-exam-title">
            {t("exam.title")}
          </h1>
          <p className="mb-6 text-muted-foreground">
            {language === "fr"
              ? "L'examen contient 10 questions. Vous avez 10 minutes pour le compléter."
              : "Ny fanadinana dia misy fanontaniana 10. Manana minitra 10 ianao hamaranana azy."}
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={() => setExamStarted(true)} data-testid="button-start-exam">
              {t("exam.start")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation(`/category/${categoryId}`)}
              data-testid="button-back-to-lessons"
            >
              {t("lesson.backToCategories")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ExamInterface
      questions={examQuestions}
      onComplete={handleComplete}
      onExit={() => setLocation(`/category/${categoryId}`)}
      timeLimit={600}
    />
  );
}
