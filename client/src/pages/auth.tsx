import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react"; 



export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, register, user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();


  // Formulaire de connexion
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Formulaire d'inscription
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"student" | "admin">("student");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);
      await login(loginEmail, loginPassword);
      toast({
        title: language === "fr" ? "Connexion réussie" : "Tafiditra soa aman-tsara",
        description: language === "fr" ? "Bienvenue !" : "Tonga soa!",
      });
      setLocation(user.role === "admin" ? "/admin-dashboard" : "/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: error.message,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      const user = await register(registerEmail, registerPassword, registerName, registerRole);
      await register(registerEmail, registerPassword, registerName, registerRole);
      toast({
        title: language === "fr" ? "Inscription réussie" : "Fisoratana anarana nahomby",
        description: language === "fr" ? "Bienvenue !" : "Tonga soa!",
      });
      setLocation(user.role === "admin" ? "/admin-dashboard" : "/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: error.message,
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {language === "fr" ? "MadaDriving" : "MadaDriving"}
          </h1>
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Apprendre le code de la route"
              : "Mianatra ny fitsipiky ny lalana"}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              {language === "fr" ? "Connexion" : "Hiditra"}
            </TabsTrigger>
            <TabsTrigger value="register">
              {language === "fr" ? "Inscription" : "Hisoratra anarana"}
            </TabsTrigger>
          </TabsList>

          {/* Formulaire de connexion */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">
                  {language === "fr" ? "Email" : "Mailaka"}
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder={language === "fr" ? "votre@email.com" : "mailaka@example.com"}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">
                  {language === "fr" ? "Mot de passe" : "Teny miafina"}
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading
                  ? language === "fr"
                    ? "Connexion..."
                    : "Miditra..."
                  : language === "fr"
                  ? "Se connecter"
                  : "Hiditra"}
              </Button>
            </form>
          </TabsContent>

          {/* Formulaire d'inscription */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">
                  {language === "fr" ? "Nom complet" : "Anarana feno"}
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder={language === "fr" ? "Votre nom" : "Ny anaranao"}
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">
                  {language === "fr" ? "Email" : "Mailaka"}
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder={language === "fr" ? "votre@email.com" : "mailaka@example.com"}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">
                  {language === "fr" ? "Mot de passe" : "Teny miafina"}
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  {language === "fr" ? "Minimum 6 caractères" : "6 litera fara fahakeliny"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{language === "fr" ? "Type de compte" : "Karazana kaonty"}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={registerRole === "student" ? "default" : "outline"}
                    onClick={() => setRegisterRole("student")}
                    className="w-full"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {language === "fr" ? "Étudiant" : "Mpianatra"}
                  </Button>
                  <Button
                    type="button"
                    variant={registerRole === "admin" ? "default" : "outline"}
                    onClick={() => setRegisterRole("admin")}
                    className="w-full"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {language === "fr" ? "Admin" : "Mpitantana"}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={registerLoading}>
                {registerLoading
                  ? language === "fr"
                    ? "Inscription..."
                    : "Misoratra anarana..."
                  : language === "fr"
                  ? "S'inscrire"
                  : "Hisoratra anarana"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}