import { Moon, Sun, Globe, BarChart3, LogOut, User, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  mode?: "student" | "admin";
  onModeChange?: () => void;
}

export default function Header({ mode = "student", onModeChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold" data-testid="text-app-title">
            {t("header.title")}
          </h1>
        </div>

        <div className="flex items-center gap-2">
        {user && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => setLocation(user.role === "admin" ? "/admin-dashboard" : "/dashboard")}
    data-testid="button-dashboard"
  >
    <BarChart3 className="h-4 w-4 mr-2" />
    {language === "fr" ? "Tableau de bord" : "Tondrozotra"}
  </Button>
)}

          {user && onModeChange && (
            <Button
              variant="outline"
              size="sm"
              onClick={onModeChange}
              data-testid="button-mode-toggle"
            >
              {mode === "student" ? t("header.admin") : t("header.student")}
            </Button>
          )}

          {user && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.name}</span>
            </div>
          )}

{user && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => setLocation("/profile")}
  >
    <UserCircle className="h-4 w-4 mr-2" />
    <span className="hidden sm:inline">
      {language === "fr" ? "Mon profil" : "Ny profila-ko"}
    </span>
  </Button>
)}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" data-testid="button-language-toggle">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage("fr")}
                data-testid="menu-item-french"
                className={language === "fr" ? "bg-accent" : ""}
              >
                Français
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("mg")}
                data-testid="menu-item-malagasy"
                className={language === "mg" ? "bg-accent" : ""}
              >
                Malagasy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">
                {language === "fr" ? "Déconnexion" : "Hivoaka"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}