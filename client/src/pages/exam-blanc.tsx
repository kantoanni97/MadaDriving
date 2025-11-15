import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Check, X, Volume2, VolumeX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const EXAM_QUESTION_COUNT = 40;

export default function ExamBlanc() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const { speak, stop, speaking } = useSpeech();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: [`/api/questions/random/${EXAM_QUESTION_COUNT}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-6 h-10 w-64" />
        <Skeleton className="mb-6 h-96" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Aucune question disponible pour l'examen blanc."
              : "Tsy misy fanontaniana ho an'ny fanadinana blancs."}
          </p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("lesson.backToCategories")}
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];

  const handleAnswerSelect = (optionNumber: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionNumber,
    });
  };

  const handleNext = () => {
    stop(); // Arrêter la lecture lors du changement de question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    stop(); // Arrêter la lecture lors du changement de question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async() => {
    await saveExamResult();
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const saveExamResult = async () => {
    try {
      const score = calculateScore();
      const percentage = Math.round((score / questions.length) * 100);
      
      await fetch("/api/exam-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: null, // NULL pour examen blanc
          score,
          totalQuestions: questions.length,
          passed: percentage >= 70,
          answers: JSON.stringify(answers),
        }),
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const getOptionText = (question: Question, optionNumber: number) => {
    const options = [
      { fr: question.option1Fr, mg: question.option1Mg },
      { fr: question.option2Fr, mg: question.option2Mg },
      { fr: question.option3Fr, mg: question.option3Mg },
      { fr: question.option4Fr, mg: question.option4Mg },
    ];
    return language === "fr" ? options[optionNumber - 1].fr : options[optionNumber - 1].mg;
  };

  const handleSpeak = () => {
    if (speaking) {
      stop();
    } else {
      const questionText = language === "fr" ? currentQuestion.questionFr : currentQuestion.questionMg;
      const optionsText = options.map((opt, idx) => 
        `${language === "fr" ? "Option" : "Safidy"} ${idx + 1}: ${language === "fr" ? opt.textFr : opt.textMg}`
      ).join(". ");
      speak(`${questionText}. ${optionsText}`, language);
    }
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="p-8 text-center mb-8">
          <div className="mb-6">
            {passed ? (
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            ) : (
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
            )}
          </div>

          <h2 className="mb-4 text-3xl font-bold">
            {language === "fr" ? "Résultats de l'examen blanc" : "Valin'ny fanadinana blancs"}
          </h2>

          <div className="mb-6">
            <p className="text-5xl font-bold mb-2">{percentage}%</p>
            <p className="text-xl text-muted-foreground">
              {score} / {questions.length} {language === "fr" ? "bonnes réponses" : "valiny marina"}
            </p>
          </div>

          {passed ? (
            <p className="mb-6 text-lg text-green-600">
              {language === "fr"
                ? "Félicitations ! Vous avez réussi l'examen blanc !"
                : "Arahabaina! Nahavita ny fanadinana blancs ianao!"}
            </p>
          ) : (
            <p className="mb-6 text-lg text-red-600">
              {language === "fr"
                ? "Continuez à vous entraîner. Il faut au moins 70% pour réussir."
                : "Manohy manao fanazaran-tena. Mila 70% farafahakeliny mba hahomby."}
            </p>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              {language === "fr" ? "Refaire l'examen" : "Avereno ny fanadinana"}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "fr" ? "Retour à l'accueil" : "Miverina any am-panombohana"}
            </Button>
          </div>
        </Card>

        {/* Section de correction détaillée */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4">
            {language === "fr" ? "Correction détaillée" : "Fanitsiana amin'ny antsipiriany"}
          </h3>

          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAnswered = userAnswer !== undefined;

            return (
              <Card key={question.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        {language === "fr" ? "Question" : "Fanontaniana"} {index + 1}
                      </span>
                      <h4 className="text-lg font-semibold mt-1">
                        {language === "fr" ? question.questionFr : question.questionMg}
                      </h4>
                    </div>

                    {question.imageUrl && (
                      <div className="mb-4 overflow-hidden rounded-lg max-w-md">
                        <img
                          src={question.imageUrl}
                          alt="Question"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((optionNum) => {
                        const isUserAnswer = userAnswer === optionNum;
                        const isCorrectAnswer = question.correctAnswer === optionNum;

                        return (
                          <div
                            key={optionNum}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-50"
                                : isUserAnswer && !isCorrect
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                              )}
                              <span className="font-medium text-sm">
                                {language === "fr" ? "Option" : "Safidy"} {optionNum}:
                              </span>
                              <span className={isCorrectAnswer ? "font-semibold" : ""}>
                                {getOptionText(question, optionNum)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!wasAnswered && (
                      <p className="mt-3 text-sm text-orange-600 font-medium">
                        {language === "fr"
                          ? "⚠️ Question non répondue"
                          : "⚠️ Fanontaniana tsy voavaliny"}
                      </p>
                    )}

                    {wasAnswered && (
                      <div className="mt-3 text-sm">
                        {isCorrect ? (
                          <span className="text-green-600 font-medium">
                            ✓ {language === "fr" ? "Bonne réponse !" : "Valiny marina!"}
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            ✗{" "}
                            {language === "fr"
                              ? `Mauvaise réponse. La bonne réponse était l'option ${question.correctAnswer}.`
                              : `Valiny diso. Ny valiny marina dia ny safidy ${question.correctAnswer}.`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={() => window.location.reload()} size="lg">
            {language === "fr" ? "Refaire l'examen" : "Avereno ny fanadinana"}
          </Button>
        </div>
      </div>
    );
  }

  const options = [
    {
      number: 1,
      textFr: currentQuestion.option1Fr,
      textMg: currentQuestion.option1Mg,
    },
    {
      number: 2,
      textFr: currentQuestion.option2Fr,
      textMg: currentQuestion.option2Mg,
    },
    {
      number: 3,
      textFr: currentQuestion.option3Fr,
      textMg: currentQuestion.option3Mg,
    },
    {
      number: 4,
      textFr: currentQuestion.option4Fr,
      textMg: currentQuestion.option4Mg,
    },
  ];

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("lesson.backToCategories")}
          </Button>
          <div className="text-sm text-muted-foreground">
            {language === "fr" ? "Question" : "Fanontaniana"} {currentQuestionIndex + 1} /{" "}
            {questions.length}
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">
                {language === "fr" ? "Examen Blanc" : "Fanadinana Blancs"}
              </h2>
              <p className="text-lg font-medium">
                {language === "fr" ? currentQuestion.questionFr : currentQuestion.questionMg}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSpeak}
              className="flex-shrink-0"
            >
              {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {currentQuestion.imageUrl && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={currentQuestion.imageUrl}
                alt="Question"
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          <RadioGroup
            key={currentQuestion.id}
            value={selectedAnswer !== undefined ? selectedAnswer.toString() : undefined}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {options.map((option) => (
              <div
                key={option.number}
                className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent"
              >
                <RadioGroupItem value={option.number.toString()} id={`option-${option.number}`} />
                <Label
                  htmlFor={`option-${option.number}`}
                  className="flex-1 cursor-pointer text-base"
                >
                  {language === "fr" ? option.textFr : option.textMg}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {language === "fr"
                ? `Questions répondues: ${answeredCount} / ${questions.length}`
                : `Fanontaniana voavaliny: ${answeredCount} / ${questions.length}`}
            </p>
          </div>
        </Card>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("lesson.previous")}
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!allAnswered}>
              {language === "fr" ? "Terminer l'examen" : "Mamita ny fanadinana"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {t("lesson.next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}