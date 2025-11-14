import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import { Clock, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  timeLimit?: number;
}

export default function ExamInterface({
  questions,
  onComplete,
  onExit,
  timeLimit = 600,
}: ExamInterfaceProps) {
  const { t, language } = useLanguage();
  const { speak, stop, speaking } = useSpeech();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    onComplete(answers.map((a) => a ?? -1));
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 300);
  };

  const handleSpeak = () => {
    const question = questions[currentQuestion];
    if (speaking) {
      stop();
    } else {
      speak(question.question, language);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onExit} data-testid="button-exit-exam">
              <X className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium" data-testid="text-question-counter">
              {t("exam.question")} {currentQuestion + 1} {t("exam.of")} {questions.length}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1",
              timeLeft < 60 && "bg-destructive/10 text-destructive"
            )}
            data-testid="text-timer"
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono font-semibold">
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold" data-testid="text-question">
              {questions[currentQuestion].question}
            </h2>
            <Button variant="outline" size="icon" onClick={handleSpeak} data-testid="button-speak">
              {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {questions[currentQuestion].imageUrl && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={questions[currentQuestion].imageUrl}
                alt="Question"
                className="h-auto w-full object-cover"
                data-testid="img-question"
              />
            </div>
          )}

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Card
                key={index}
                className={cn(
                  "cursor-pointer p-4 transition-all hover-elevate active-elevate-2",
                  answers[currentQuestion] === index && "border-primary bg-primary/5"
                )}
                onClick={() => handleAnswer(index)}
                data-testid={`option-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold",
                      answers[currentQuestion] === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            {currentQuestion === questions.length - 1 ? (
              <Button size="lg" onClick={handleSubmit} data-testid="button-submit-exam">
                {t("exam.submit")}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={currentQuestion >= questions.length - 1}
                data-testid="button-next-question"
              >
                {t("exam.next")}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
