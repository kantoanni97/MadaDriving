import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, TrendingUp, Award, Target, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalExams: number;
  passedExams: number;
  averageScore: number;
  examsBlancsCount: number;
  examsByCategoryCount: number;
}

interface ExamResult {
  id: string;
  categoryId: string | null;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: string;
  createdAt: string;
}

interface Category {
  id: string;
  nameFr: string;
  nameMg: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/exam-results/stats"],
  });

  const { data: history, isLoading: historyLoading } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results/history"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) {
      return language === "fr" ? "Examen Blanc" : "Fanadinana Blancs";
    }
    const category = categories?.find(c => c.id === categoryId);
    return category ? (language === "fr" ? category.nameFr : category.nameMg) : "---";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "mg-MG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (statsLoading || historyLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const successRate = stats && stats.totalExams > 0
    ? Math.round((stats.passedExams / stats.totalExams) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            {language === "fr" ? "Tableau de bord" : "Tondrozotra"}
          </h1>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Accueil" : "Fanombohana"}
          </Button>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Examens passés" : "Fanadinana vita"}
                </p>
                <p className="text-2xl font-bold">{stats?.totalExams || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Taux de réussite" : "Tahan'ny fahombiazana"}
                </p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Score moyen" : "Isa antonony"}
                </p>
                <p className="text-2xl font-bold">{stats?.averageScore || 0}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Examens réussis" : "Fanadinana nahomby"}
                </p>
                <p className="text-2xl font-bold">{stats?.passedExams || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Types d'examens */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {language === "fr" ? "Examens Blancs" : "Fanadinana Blancs"}
            </h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.examsBlancsCount || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "fr" ? "examens tous confondus" : "fanadinana rehetra"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {language === "fr" ? "Examens par Catégorie" : "Fanadinana isaky ny sokajy"}
            </h3>
            <p className="text-3xl font-bold text-green-600">{stats?.examsByCategoryCount || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "fr" ? "examens ciblés" : "fanadinana voafaritra"}
            </p>
          </Card>
        </div>

        {/* Historique des examens */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {language === "fr" ? "Historique des examens" : "Tantaran'ny fanadinana"}
          </h2>

          {!history || history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "fr"
                  ? "Aucun examen passé pour le moment. Commencez à apprendre !"
                  : "Tsy mbola nisy fanadinana natao. Manomboka mianatra!"}
              </p>
              <Button onClick={() => setLocation("/")} className="mt-4">
                {language === "fr" ? "Commencer" : "Manomboka"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((result) => {
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <Card key={result.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-full ${result.passed ? "bg-green-100" : "bg-red-100"}`}>
                          {result.passed ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {getCategoryName(result.categoryId)}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(result.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-2xl font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}>
                          {percentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.score} / {result.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}