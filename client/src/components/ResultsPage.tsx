import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Question {
  id: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
}

interface ResultsPageProps {
  questions: Question[];
  userAnswers: number[];
  onRetake: () => void;
  onBackToLessons: () => void;
}

export default function ResultsPage({
  questions,
  userAnswers,
  onRetake,
  onBackToLessons,
}: ResultsPageProps) {
  const { t } = useLanguage();

  const correctCount = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 70;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="mb-8 p-8 text-center">
          <div className="mb-4">
            {passed ? (
              <CheckCircle2 className="mx-auto h-20 w-20 text-green-600" data-testid="icon-passed" />
            ) : (
              <XCircle className="mx-auto h-20 w-20 text-destructive" data-testid="icon-failed" />
            )}
          </div>

          <h1 className="mb-2 text-3xl font-bold" data-testid="text-results-title">
            {t("results.title")}
          </h1>

          <div className="mb-6">
            <div className="mb-2 text-6xl font-bold" data-testid="text-score">
              {score}%
            </div>
            <Badge
              variant={passed ? "default" : "destructive"}
              className="text-base"
              data-testid="badge-pass-status"
            >
              {passed ? t("results.passed") : t("results.failed")}
            </Badge>
          </div>

          <div className="mb-6 text-muted-foreground" data-testid="text-correct-count">
            {correctCount} {t("results.correct")} / {questions.length} {t("exam.question")}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={onRetake} size="lg" data-testid="button-retake">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("results.retake")}
            </Button>
            <Button onClick={onBackToLessons} variant="outline" size="lg" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("results.backToLessons")}
            </Button>
          </div>
        </Card>

        <h2 className="mb-4 text-2xl font-semibold">{t("results.title")}</h2>

        <Accordion type="single" collapsible className="space-y-4">
          {questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer;
            const userAnswer = userAnswers[index];

            return (
              <AccordionItem
                key={question.id}
                value={question.id}
                className="rounded-lg border"
              >
                <AccordionTrigger
                  className="px-4 hover:no-underline"
                  data-testid={`accordion-question-${index}`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="text-left font-medium">
                      {index + 1}. {question.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {question.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={question.imageUrl}
                        alt="Question"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={cn(
                          "rounded-md border p-3",
                          optionIndex === question.correctAnswer && "border-green-600 bg-green-50 dark:bg-green-950/20",
                          userAnswer === optionIndex && !isCorrect && "border-destructive bg-destructive/5"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <Badge variant="default" className="bg-green-600">
                              {t("results.correctAnswer")}
                            </Badge>
                          )}
                          {userAnswer === optionIndex && !isCorrect && (
                            <Badge variant="destructive">{t("results.yourAnswer")}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
