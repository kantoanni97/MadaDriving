import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User, Mail, Lock, Save, Shield, Sparkles, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface UserStats {
  totalExams: number;
  passedExams: number;
  averageScore: number;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: stats } = useQuery<UserStats>({
    queryKey: [`/api/users/${user?.id}/stats`],
    enabled: !!user?.id && user?.role === "student",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedUser = { ...user, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();

      toast({
        title: language === "fr" ? "Profil mis à jour" : "Profila navao",
        description: language === "fr" ? "Vos informations ont été mises à jour" : "Navao ny mombamomba anao",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: language === "fr" ? "Impossible de mettre à jour le profil" : "Tsy afaka manavao ny profila",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: language === "fr" ? "Les mots de passe ne correspondent pas" : "Tsy mitovy ny teny miafina",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: language === "fr" ? "Le mot de passe doit contenir au moins 6 caractères" : "Ny teny miafina dia tokony 6 litera fara fahakeliny",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${user?.id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast({
        title: language === "fr" ? "Mot de passe modifié" : "Teny miafina novaina",
        description: language === "fr" ? "Votre mot de passe a été modifié avec succès" : "Voaova soa aman-tsara ny teny miafinao",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: error.message || (language === "fr" ? "Impossible de changer le mot de passe" : "Tsy afaka manova ny teny miafina"),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-900/5">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header avec badge premium */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">
                {language === "fr" ? "Mon Profil" : "Ny Profila-ko"}
              </h1>
              {user.role === "admin" && (
                <div className="px-3 py-1 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent-foreground" />
                  <span className="text-xs font-bold text-accent-foreground">ADMIN</span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground">
              {language === "fr" ? "Gérez vos informations personnelles" : "Tantano ny mombamomba anao"}
            </p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")} className="border-primary-200 hover:border-primary-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Retour" : "Miverina"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne gauche : Infos et Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations du profil */}
            <Card className="p-6 border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">
                  {language === "fr" ? "Informations personnelles" : "Fampahalalana manokana"}
                </h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Nom complet" : "Anarana feno"}
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 border-primary-200 focus:border-primary-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Email" : "Mailaka"}
                  </Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="h-12 bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === "fr" ? "L'email ne peut pas être modifié" : "Tsy azo ovaina ny mailaka"}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdating} 
                  className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {language === "fr" ? "Enregistrer les modifications" : "Tahiry ny fanovana"}
                </Button>
              </form>
            </Card>

            {/* Changer le mot de passe */}
            <Card className="p-6 border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">
                  {language === "fr" ? "Sécurité" : "Fiarovana"}
                </h2>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Mot de passe actuel" : "Teny miafina ankehitriny"}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="h-12 border-primary-200 focus:border-primary-500"
                  />
                </div>

                <div>
                  <Label htmlFor="new-password" className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Nouveau mot de passe" : "Teny miafina vaovao"}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 border-primary-200 focus:border-primary-500"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Confirmer le mot de passe" : "Hamafiso ny teny miafina"}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 border-primary-200 focus:border-primary-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {language === "fr" ? "Changer le mot de passe" : "Manova ny teny miafina"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Colonne droite : Statistiques */}
          {user.role === "student" && stats && (
            <div className="space-y-6">
              <Card className="p-6 border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-accent" />
                  <h2 className="text-xl font-bold">
                    {language === "fr" ? "Mes performances" : "Ny zava-bitako"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "fr" ? "Examens passés" : "Fanadinana vita"}
                    </p>
                    <p className="text-4xl font-bold text-blue-600">{stats.totalExams}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "fr" ? "Examens réussis" : "Fanadinana nahomby"}
                    </p>
                    <p className="text-4xl font-bold text-green-600">{stats.passedExams}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === "fr" ? "Score moyen" : "Isa antonony"}
                    </p>
                    <p className="text-4xl font-bold text-purple-600">{stats.averageScore}%</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setLocation("/dashboard")}
                  >
                    {language === "fr" ? "Voir les détails →" : "Hijery ny antsipiriany →"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}