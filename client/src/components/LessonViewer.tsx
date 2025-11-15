import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import { ArrowLeft, ArrowRight, Volume2, VolumeX, BookOpen, CheckCircle2 } from "lucide-react";

interface LessonViewerProps {
  title: string;
  content: string;
  imageUrl?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onBack: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalLessons?: number;
}

export default function LessonViewer({
  title,
  content,
  imageUrl,
  onPrevious,
  onNext,
  onBack,
  hasPrevious = false,
  hasNext = true,
  currentIndex = 0,
  totalLessons = 1,
}: LessonViewerProps) {
  const { t, language } = useLanguage();
  const { speak, stop, speaking } = useSpeech();

  const handleSpeak = () => {
    if (speaking) {
      stop();
    } else {
      speak(`${title}. ${content}`, language);
    }
  };

  const progress = ((currentIndex + 1) / totalLessons) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-900/5">
      {/* Header fixe avec progression */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b-2 border-primary-500/20 shadow-lg">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-primary-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("lesson.backToCategories")}
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <BookOpen className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-primary-600">
                {currentIndex + 1} / {totalLessons}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === "fr" ? "Progression" : "Fandrosoana"}
              </span>
              <span className="font-semibold text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Contenu de la leçon */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="overflow-hidden border-2 border-primary-500/20 shadow-2xl">
          {/* Header de la leçon */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm mb-4 backdrop-blur-sm">
                  <BookOpen className="h-4 w-4" />
                  <span>{language === "fr" ? "Leçon" : "Lesona"} {currentIndex + 1}</span>
                </div>
                <h1 className="text-3xl font-bold leading-tight">
                  {title}
                </h1>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSpeak}
                className="flex-shrink-0 shadow-lg"
              >
                {speaking ? (
                  <>
                    <VolumeX className="h-5 w-5 mr-2" />
                    {language === "fr" ? "Arrêter" : "Ajanona"}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    {language === "fr" ? "Écouter" : "Mihaino"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Image si présente */}
          {imageUrl && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/50 z-10" />
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}

          {/* Contenu de la leçon */}
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {content}
              </p>
            </div>

            {/* Points clés (optionnel - peut être ajouté plus tard) */}
            {currentIndex === totalLessons - 1 && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">
                      {language === "fr" ? "Dernière leçon !" : "Lesona farany!"}
                    </h3>
                    <p className="text-green-800 dark:text-green-200">
                      {language === "fr"
                        ? "Vous avez terminé toutes les leçons de cette catégorie. Passez maintenant à l'examen pour tester vos connaissances !"
                        : "Vitanao ny lesona rehetra ao amin'ity sokajy ity. Mandehana amin'ny fanadinana hanandramana ny fahalalanao!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="min-w-40 border-2 hover:border-primary-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("lesson.previous")}
          </Button>

          <Button
            size="lg"
            onClick={onNext}
            className="min-w-40 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            {currentIndex === totalLessons - 1 
              ? (language === "fr" ? "Passer à l'examen" : "Mankany amin'ny fanadinana")
              : t("lesson.next")
            }
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}