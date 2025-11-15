import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import ExamInterface from "@/components/ExamInterface";
import ResultsPage from "@/components/ResultsPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  categoryId: string;
  questionFr: string;
  questionMg: string;
  imageUrl: string | null;
  option1Fr: string;
  option1Mg: string;
  option2Fr: string;
  option2Mg: string;
  option3Fr: string;
  option3Mg: string;
  option4Fr: string;
  option4Mg: string;
  correctAnswer: number;
}

interface ExamQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
}

export default function Exam() {
  const [, params] = useRoute("/exam/:categoryId");
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [examStarted, setExamStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const categoryId = params?.categoryId || "";

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions/category", categoryId],
    enabled: !!categoryId,
  });

  const saveResultMutation = useMutation({
    mutationFn: async (data: {
      userId?: string;
      categoryId: string;
      score: number;
      totalQuestions: number;
      passed: boolean;
      answers: string;
    }) => {
      return await apiRequest("POST", "/api/exam-results", data);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-96 w-full max-w-md" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Aucune question disponible dans cette catégorie."
              : "Tsy misy fanontaniana ao amin'ity sokajy ity."}
          </p>
        </Card>
      </div>
    );
  }

  const transformQuestion = (q: Question): ExamQuestion => ({
    id: q.id,
    question: language === "fr" ? q.questionFr : q.questionMg,
    imageUrl: q.imageUrl || undefined,
    options: [
      language === "fr" ? q.option1Fr : q.option1Mg,
      language === "fr" ? q.option2Fr : q.option2Mg,
      language === "fr" ? q.option3Fr : q.option3Mg,
      language === "fr" ? q.option4Fr : q.option4Mg,
    ],
    correctAnswer: q.correctAnswer,
  });

  const examQuestions = questions.slice(0, 10).map(transformQuestion);

  const handleComplete = async (answers: number[]) => {
    const correctCount = answers.filter(
      (answer, index) => answer === examQuestions[index].correctAnswer
    ).length;
    const score = Math.round((correctCount / examQuestions.length) * 100);
    const passed = score >= 70;

    await saveResultMutation.mutateAsync({
      userId: user?.id,
      categoryId,
      score,
      totalQuestions: examQuestions.length,
      passed,
      answers: JSON.stringify(answers),
    });

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
              ? `L'examen contient ${examQuestions.length} questions. Vous avez 10 minutes pour le compléter.`
              : `Ny fanadinana dia misy fanontaniana ${examQuestions.length}. Manana minitra 10 ianao hamaranana azy.`}
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
