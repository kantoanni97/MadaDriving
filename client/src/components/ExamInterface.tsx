import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Question {
  id: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
}

interface ExamInterfaceProps {
  questions: Question[];
  onComplete: (answers: number[]) => void;
  onExit: () => void;
  timeLimit?: number; // en secondes
}

export default function ExamInterface({
  questions,
  onComplete,
  onExit,
  timeLimit = 600,
}: ExamInterfaceProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);
  };

  const handleComplete = () => {
    const finalAnswers = answers.map((a) => (a === null ? 0 : a));
    onComplete(finalAnswers);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;
  const currentQuestion = questions[currentIndex];
  const isLowTime = timeLeft < 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-900/5">
      {/* Header fixe */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b-2 border-primary-500/20 shadow-lg">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExitDialog(true)}
              className="text-muted-foreground hover:text-primary-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "fr" ? "Quitter" : "Hiala"}
            </Button>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold ${
              isLowTime ? "bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse" : "bg-primary-100 dark:bg-primary-900/30 text-primary-600"
            }`}>
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                {language === "fr" ? "Question" : "Fanontaniana"} {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-primary-600 font-semibold">
                {answeredCount} / {questions.length} {language === "fr" ? "répondues" : "voavaliny"}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="p-8 border-2 border-primary-500/20 shadow-2xl">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                {currentIndex + 1}
              </div>
              <h2 className="text-2xl font-bold flex-1 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {currentQuestion.imageUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border-2 border-primary-200 shadow-lg">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <RadioGroup
            value={answers[currentIndex]?.toString() || ""}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => {
              const optionNumber = index + 1;
              const isSelected = answers[currentIndex] === optionNumber;
              
              return (
                <div
                  key={optionNumber}
                  className={`relative rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg shadow-primary-500/20"
                      : "border-border hover:border-primary-300 hover:bg-muted/50"
                  }`}
                >
                  <Label
                    htmlFor={`option-${optionNumber}`}
                    className="flex items-center gap-4 p-5 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={optionNumber.toString()}
                      id={`option-${optionNumber}`}
                      className="flex-shrink-0"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isSelected 
                          ? "bg-primary-500 text-white" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`text-base ${isSelected ? "font-semibold text-primary-600" : ""}`}>
                        {option}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {/* Warning si pas répondu */}
          {answers[currentIndex] === null && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {language === "fr" 
                  ? "N'oubliez pas de sélectionner une réponse avant de continuer"
                  : "Aza adino misafidy valiny alohan'ny hanohy"}
              </p>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="min-w-32"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Précédent" : "Taloha"}
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={answeredCount < questions.length}
              className="min-w-32 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              {language === "fr" ? "Terminer" : "Vita"}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="min-w-32 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              {language === "fr" ? "Suivant" : "Manaraka"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Dialog de confirmation de sortie */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "fr" ? "Quitter l'examen ?" : "Hiala amin'ny fanadinana?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "fr"
                ? "Êtes-vous sûr de vouloir quitter ? Votre progression ne sera pas sauvegardée."
                : "Azo antoka ve fa te hiala? Tsy ho voatahiry ny fandrosoanao."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "fr" ? "Continuer l'examen" : "Hanohy ny fanadinana"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onExit} className="bg-destructive">
              {language === "fr" ? "Quitter" : "Hiala"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}