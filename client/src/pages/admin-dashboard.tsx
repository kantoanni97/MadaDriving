import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Users, BookOpen, HelpCircle, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface Category {
  id: string;
  nameFr: string;
  nameMg: string;
}

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalCategories: number;
  totalLessons: number;
  totalQuestions: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  // Pour l'instant, on va créer des stats simulées
  // Vous pourrez ajouter les vraies routes API plus tard
  const stats: Stats = {
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalCategories: 0,
    totalLessons: 0,
    totalQuestions: 0,
  };

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "mg-MG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              {language === "fr" ? "Tableau de bord Admin" : "Tondrozotra Mpitantana"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "fr" 
                ? "Gérez les étudiants, les catégories, les leçons et les questions"
                : "Mitantana ny mpianatra, sokajy, lesona ary fanontaniana"}
            </p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Accueil" : "Fanombohana"}
          </Button>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Total Étudiants" : "Mpianatra rehetra"}
                </p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Catégories" : "Sokajy"}
                </p>
                <p className="text-2xl font-bold">{categories?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Leçons" : "Lesona"}
                </p>
                <p className="text-2xl font-bold">{stats.totalLessons}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "fr" ? "Questions" : "Fanontaniana"}
                </p>
                <p className="text-2xl font-bold">{stats.totalQuestions}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/admin?tab=students")}>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">
                {language === "fr" ? "Gérer les Étudiants" : "Mitantana ny Mpianatra"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Voir et gérer tous les étudiants" : "Mijery sy mitantana ny mpianatra"}
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/admin?tab=categories")}>
            <div className="text-center">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">
                {language === "fr" ? "Gérer les Catégories" : "Mitantana ny Sokajy"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Créer et modifier les catégories" : "Mamorona sy manova ny sokajy"}
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/admin?tab=lessons")}>
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">
                {language === "fr" ? "Gérer les Leçons" : "Mitantana ny Lesona"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Ajouter et modifier les leçons" : "Manampy sy manova ny lesona"}
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/admin?tab=questions")}>
            <div className="text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">
                {language === "fr" ? "Gérer les Questions" : "Mitantana ny Fanontaniana"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Créer et modifier les questions" : "Mamorona sy manova ny fanontaniana"}
              </p>
            </div>
          </Card>
        </div>

        {/* Liste des catégories */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {language === "fr" ? "Catégories existantes" : "Sokajy misy"}
          </h2>

          {!categories || categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "fr"
                  ? "Aucune catégorie pour le moment."
                  : "Tsy misy sokajy."}
              </p>
              <Button onClick={() => setLocation("/admin?tab=categories")} className="mt-4">
                {language === "fr" ? "Créer une catégorie" : "Mamorona sokajy"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">
                    {language === "fr" ? category.nameFr : category.nameMg}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin?tab=lessons&category=${category.id}`)}
                    className="w-full"
                  >
                    {language === "fr" ? "Gérer les leçons" : "Mitantana ny lesona"}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}