import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, TrendingUp, Award, Target, Calendar, CheckCircle, XCircle, Trophy, Sparkles, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

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

export default function StudentDashboard() {
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

  const recentExams = history?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-900/5">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent mb-2">
              {language === "fr" ? "Tableau de bord" : "Tondrozotra"}
            </h1>
            <p className="text-muted-foreground">
              {language === "fr" ? "Suivez votre progression" : "Araho ny fandrosoanao"}
            </p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")} className="border-primary-200 hover:border-primary-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Accueil" : "Fanombohana"}
          </Button>
        </div>

        {/* Statistiques principales avec design moderne */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total examens */}
          <Card className="relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Examens passés" : "Fanadinana vita"}
                  </p>
                  <p className="text-3xl font-bold text-primary-600">{stats?.totalExams || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Taux de réussite */}
          <Card className="relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Taux de réussite" : "Tahan'ny fahombiazana"}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-green-600">{successRate}%</p>
                    {successRate >= 70 && <Trophy className="h-5 w-5 text-accent animate-pulse" />}
                  </div>
                </div>
              </div>
              <Progress value={successRate} className="mt-3 h-2" />
            </div>
          </Card>

          {/* Score moyen */}
          <Card className="relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Score moyen" : "Isa antonony"}
                  </p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.averageScore || 0}%</p>
                </div>
              </div>
              <Progress value={stats?.averageScore || 0} className="mt-3 h-2" />
            </div>
          </Card>

          {/* Examens réussis */}
          <Card className="relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-accent to-accent/80 rounded-xl shadow-lg">
                  <Award className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Examens réussis" : "Fanadinana nahomby"}
                  </p>
                  <p className="text-3xl font-bold text-accent">{stats?.passedExams || 0}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Types d'examens */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6 border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {language === "fr" ? "Examens Blancs" : "Fanadinana Blancs"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Tous confondus" : "Rehetra"}
                </p>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary-600 mb-2">{stats?.examsBlancsCount || 0}</p>
            <Button 
              onClick={() => setLocation("/exam-blanc")} 
              className="w-full mt-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              {language === "fr" ? "Passer un examen blanc" : "Manao fanadinana blancs"}
            </Button>
          </Card>

          <Card className="p-6 border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {language === "fr" ? "Examens par Catégorie" : "Fanadinana isaky ny sokajy"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Ciblés" : "Voafaritra"}
                </p>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{stats?.examsByCategoryCount || 0}</p>
            <Button 
              onClick={() => setLocation("/")} 
              variant="outline"
              className="w-full mt-4 border-green-500 text-green-600 hover:bg-green-50"
            >
              {language === "fr" ? "Choisir une catégorie" : "Misafidy sokajy"}
            </Button>
          </Card>
        </div>

        {/* Historique récent */}
        <Card className="p-6 border-2 border-primary-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold">
              {language === "fr" ? "Activité récente" : "Hetsika farany"}
            </h2>
          </div>

          {!recentExams || recentExams.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <p className="text-muted-foreground mb-4">
                {language === "fr"
                  ? "Aucun examen passé pour le moment"
                  : "Tsy mbola nisy fanadinana natao"}
              </p>
              <Button onClick={() => setLocation("/")} className="bg-gradient-to-r from-primary-500 to-primary-600">
                {language === "fr" ? "Commencer" : "Manomboka"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExams.map((result) => {
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <Card key={result.id} className="p-4 hover:shadow-lg transition-all duration-300 border hover:border-primary-500">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${result.passed ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
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
                          <p className="text-sm text-muted-foreground">
                            {formatDate(result.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-3xl font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}>
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
              
              {(history?.length || 0) > 5 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {/* TODO: Voir tout l'historique */}}
                >
                  {language === "fr" ? "Voir tout l'historique" : "Hijery ny tantara rehetra"}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}