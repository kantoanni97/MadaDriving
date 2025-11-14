import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  mode?: "student" | "admin";
  onModeChange?: () => void;
}

export default function Header({ mode = "student", onModeChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold" data-testid="text-app-title">
            {t("header.title")}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {onModeChange && (
            <Button
              variant="outline"
              size="sm"
              onClick={onModeChange}
              data-testid="button-mode-toggle"
            >
              {mode === "student" ? t("header.admin") : t("header.student")}
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
        </div>
      </div>
    </header>
  );
}
