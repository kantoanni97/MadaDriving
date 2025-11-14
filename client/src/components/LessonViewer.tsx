import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";

interface LessonViewerProps {
  title: string;
  content: string;
  imageUrl?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onBack: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
          data-testid="button-back-to-categories"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("lesson.backToCategories")}
        </Button>

        <Card className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="font-serif text-3xl font-bold" data-testid="text-lesson-title">
              {title}
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSpeak}
              data-testid="button-listen"
            >
              {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {imageUrl && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt={title}
                className="h-auto w-full object-cover"
                data-testid="img-lesson"
              />
            </div>
          )}

          <div
            className="font-serif text-lg leading-relaxed text-foreground"
            data-testid="text-lesson-content"
          >
            {content}
          </div>
        </Card>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious}
            data-testid="button-previous-lesson"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("lesson.previous")}
          </Button>
          <Button
            onClick={onNext}
            disabled={!hasNext}
            data-testid="button-next-lesson"
          >
            {t("lesson.next")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
