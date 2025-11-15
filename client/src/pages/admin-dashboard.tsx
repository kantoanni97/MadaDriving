import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Users, BookOpen, HelpCircle, FolderOpen, TrendingUp, Shield, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  nameFr: string;
  nameMg: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const stats = {
    totalStudents: users?.filter(u => u.role === "student").length || 0,
    totalAdmins: users?.filter(u => u.role === "admin").length || 0,
    totalCategories: categories?.length || 0,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-900/5">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Premium */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-accent to-accent/80 rounded-full shadow-2xl">
                  <Shield className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent mb-1">
                  {language === "fr" ? "Administration" : "Fitantanana"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {language === "fr" 
                    ? "Gérez votre plateforme d'apprentissage"
                    : "Tantano ny sehatra fianarana"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")} className="border-primary-200 hover:border-primary-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "fr" ? "Accueil" : "Fanombohana"}
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Étudiants actifs" : "Mpianatra mavitrika"}
                  </p>
                  <p className="text-4xl font-bold text-primary-600">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Catégories" : "Sokajy"}
                  </p>
                  <p className="text-4xl font-bold text-purple-600">{stats.totalCategories}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-2 border-accent/30 hover:border-accent transition-all duration-300 hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-accent to-accent/80 rounded-xl shadow-lg">
                  <Shield className="h-8 w-8 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "fr" ? "Administrateurs" : "Mpitantana"}
                  </p>
                  <p className="text-4xl font-bold text-accent">{stats.totalAdmins}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions rapides avec design premium */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h2 className="text-2xl font-bold">
              {language === "fr" ? "Actions rapides" : "Hetsika haingana"}
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              className="group relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl cursor-pointer" 
              onClick={() => setLocation("/students-management")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <div className="mb-4">
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                  {language === "fr" ? "Gérer les Étudiants" : "Mitantana ny Mpianatra"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "fr" ? "Voir et gérer tous les étudiants" : "Mijery sy mitantana ny mpianatra"}
                </p>
                <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                  {language === "fr" ? "Accéder" : "Hiditra"} →
                </div>
              </div>
            </Card>

            <Card 
              className="group relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl cursor-pointer" 
              onClick={() => setLocation("/admin")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <div className="mb-4">
                  <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <FolderOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                  {language === "fr" ? "Gérer les Catégories" : "Mitantana ny Sokajy"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "fr" ? "Créer et modifier les catégories" : "Mamorona sy manova ny sokajy"}
                </p>
                <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                  {language === "fr" ? "Accéder" : "Hiditra"} →
                </div>
              </div>
            </Card>

            <Card 
              className="group relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl cursor-pointer" 
              onClick={() => setLocation("/admin")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <div className="mb-4">
                  <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                  {language === "fr" ? "Gérer les Leçons" : "Mitantana ny Lesona"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "fr" ? "Ajouter et modifier les leçons" : "Manampy sy manova ny lesona"}
                </p>
                <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                  {language === "fr" ? "Accéder" : "Hiditra"} →
                </div>
              </div>
            </Card>

            <Card 
              className="group relative overflow-hidden border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl cursor-pointer" 
              onClick={() => setLocation("/admin")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative">
                <div className="mb-4">
                  <div className="inline-flex p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <HelpCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                  {language === "fr" ? "Gérer les Questions" : "Mitantana ny Fanontaniana"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "fr" ? "Créer et modifier les questions" : "Mamorona sy manova ny fanontaniana"}
                </p>
                <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                  {language === "fr" ? "Accéder" : "Hiditra"} →
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Aperçu des catégories */}
        <Card className="p-8 border-2 border-primary-500/20">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold">
              {language === "fr" ? "Catégories disponibles" : "Sokajy misy"}
            </h2>
          </div>

          {!categories || categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                <FolderOpen className="h-8 w-8 text-primary-600" />
              </div>
              <p className="text-muted-foreground mb-4">
                {language === "fr"
                  ? "Aucune catégorie créée pour le moment"
                  : "Tsy mbola nisy sokajy noforonina"}
              </p>
              <Button 
                onClick={() => setLocation("/admin")} 
                className="bg-gradient-to-r from-primary-500 to-primary-600"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {language === "fr" ? "Créer la première catégorie" : "Mamorona sokajy voalohany"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <Card 
                  key={category.id} 
                  className="p-5 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-500 cursor-pointer group"
                  onClick={() => setLocation("/admin")}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary-600 transition-colors">
                    {language === "fr" ? category.nameFr : category.nameMg}
                  </h3>
                  <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    {language === "fr" ? "Gérer →" : "Tantano →"}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}