import { LanguageProvider } from "@/contexts/LanguageContext";
import AdminPanel from "../AdminPanel";

export default function AdminPanelExample() {
  return (
    <LanguageProvider>
      <AdminPanel />
    </LanguageProvider>
  );
}
