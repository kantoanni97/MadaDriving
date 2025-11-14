import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "../Header";

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Header mode="student" onModeChange={() => console.log("Mode toggle clicked")} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
