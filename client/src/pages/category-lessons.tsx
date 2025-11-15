import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import LessonViewer from "@/components/LessonViewer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Lesson {
  id: string;
  categoryId: string;
  titleFr: string;
  titleMg: string;
  contentFr: string;
  contentMg: string;
  imageUrl: string | null;
  orderIndex: number;
}

export default function CategoryLessons() {
  const [, params] = useRoute("/category/:categoryId");
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const categoryId = params?.categoryId || "";

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons/category", categoryId],
    enabled: !!categoryId,
  });

  useEffect(() => {
    setCurrentLessonIndex(0);
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-6 h-10 w-40" />
        <Skeleton className="mb-6 h-96" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Aucune leçon disponible dans cette catégorie."
              : "Tsy misy lesona ao amin'ity sokajy ity."}
          </p>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      setLocation(`/exam/${categoryId}`);
    }
  };

  return (
    <LessonViewer
      title={language === "fr" ? currentLesson.titleFr : currentLesson.titleMg}
      content={language === "fr" ? currentLesson.contentFr : currentLesson.contentMg}
      imageUrl={currentLesson.imageUrl || undefined}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onBack={() => setLocation("/")}
      hasPrevious={currentLessonIndex > 0}
      //hasNext={currentLessonIndex < lessons.length - 1}
      hasNext={true}
      currentIndex={currentLessonIndex}  
      totalLessons={lessons.length}      
    />
  );
}
