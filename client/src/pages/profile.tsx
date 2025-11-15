import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User, Mail, Lock, Save } from "lucide-react";
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
    enabled: !!user?.id,
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

      // Mettre à jour le localStorage
      const updatedUser = { ...user, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload(); // Pour recharger les données

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            {language === "fr" ? "Mon Profil" : "Ny Profila-ko"}
          </h1>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Retour" : "Miverina"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations du profil */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="h-6 w-6" />
              {language === "fr" ? "Informations" : "Fampahalalana"}
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  {language === "fr" ? "Nom complet" : "Anarana feno"}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">
                  {language === "fr" ? "Email" : "Mailaka"}
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "fr" ? "L'email ne peut pas être modifié" : "Tsy azo ovaina ny mailaka"}
                </p>
              </div>

              <div>
                <Label>
                  {language === "fr" ? "Rôle" : "Andraikitra"}
                </Label>
                <Input
                  value={user.role === "admin" ? "Admin" : (language === "fr" ? "Étudiant" : "Mpianatra")}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Button type="submit" disabled={isUpdating} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {language === "fr" ? "Enregistrer" : "Tahiry"}
              </Button>
            </form>
          </Card>

          {/* Statistiques (seulement pour les étudiants) */}
          {user.role === "student" && stats && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {language === "fr" ? "Mes Statistiques" : "Ny Isa-ko"}
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Examens passés" : "Fanadinana vita"}
                  </p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalExams}</p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Examens réussis" : "Fanadinana nahomby"}
                  </p>
                  <p className="text-3xl font-bold text-green-600">{stats.passedExams}</p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Score moyen" : "Isa antonony"}
                  </p>
                  <p className="text-3xl font-bold text-purple-600">{stats.averageScore}%</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/dashboard")}
                >
                  {language === "fr" ? "Voir le tableau de bord complet" : "Hijery ny tondrozotra feno"}
                </Button>
              </div>
            </Card>
          )}

          {/* Changer le mot de passe */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              {language === "fr" ? "Changer le mot de passe" : "Manova ny teny miafina"}
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="current-password">
                  {language === "fr" ? "Mot de passe actuel" : "Teny miafina ankehitriny"}
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="new-password">
                  {language === "fr" ? "Nouveau mot de passe" : "Teny miafina vaovao"}
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">
                  {language === "fr" ? "Confirmer le mot de passe" : "Hamafiso ny teny miafina"}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" disabled={isUpdating}>
                <Lock className="mr-2 h-4 w-4" />
                {language === "fr" ? "Changer le mot de passe" : "Manova ny teny miafina"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}