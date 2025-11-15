import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, ShieldCheck, Mail, Lock, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-background to-primary-950 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative backdrop-blur-xl bg-card/80 border-2 border-primary-500/20 shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 shadow-lg shadow-primary-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">
              MadaDriving
            </h1>
            <p className="text-muted-foreground">
              {language === "fr"
                ? "Votre plateforme d'apprentissage"
                : "Sehatra fianarana"}
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                {language === "fr" ? "Connexion" : "Hiditra"}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary-500 data-[state=active]:text-white">
                {language === "fr" ? "Inscription" : "Hisoratra anarana"}
              </TabsTrigger>
            </TabsList>

            {/* Formulaire de connexion */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Email" : "Mailaka"}
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={language === "fr" ? "votre@email.com" : "mailaka@example.com"}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="h-12 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Mot de passe" : "Teny miafina"}
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-12 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all duration-300" 
                  disabled={loginLoading}
                >
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
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Nom complet" : "Anarana feno"}
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder={language === "fr" ? "Votre nom" : "Ny anaranao"}
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="h-12 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Email" : "Mailaka"}
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={language === "fr" ? "votre@email.com" : "mailaka@example.com"}
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="h-12 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary-600" />
                    {language === "fr" ? "Mot de passe" : "Teny miafina"}
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "fr" ? "Minimum 6 caractères" : "6 litera fara fahakeliny"}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>{language === "fr" ? "Type de compte" : "Karazana kaonty"}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterRole("student")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                        registerRole === "student"
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 shadow-lg shadow-primary-500/20"
                          : "border-border hover:border-primary-300"
                      }`}
                    >
                      <GraduationCap className={`w-8 h-8 ${registerRole === "student" ? "text-primary-600" : "text-muted-foreground"}`} />
                      <span className={`font-medium text-sm ${registerRole === "student" ? "text-primary-600" : ""}`}>
                        {language === "fr" ? "Étudiant" : "Mpianatra"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole("admin")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                        registerRole === "admin"
                          ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <ShieldCheck className={`w-8 h-8 ${registerRole === "admin" ? "text-accent" : "text-muted-foreground"}`} />
                      <span className={`font-medium text-sm ${registerRole === "admin" ? "text-accent" : ""}`}>
                        {language === "fr" ? "Admin" : "Mpitantana"}
                      </span>
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all duration-300" 
                  disabled={registerLoading}
                >
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
        </div>
      </Card>
    </div>
  );
}