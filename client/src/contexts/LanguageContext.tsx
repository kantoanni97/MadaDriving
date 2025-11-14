import { createContext, useContext, useState } from "react";

type Language = "fr" | "mg";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  "header.title": { fr: "Permis de Conduire Madagascar", mg: "Fahazoan-dàlana Mitondra Fiara Madagasikara" },
  "header.student": { fr: "Mode Étudiant", mg: "Mpianatra" },
  "header.admin": { fr: "Mode Administrateur", mg: "Mpitantana" },
  
  // Home
  "home.title": { fr: "Apprenez le Code de la Route", mg: "Mianatra ny Fitsipiky ny Lalana" },
  "home.subtitle": { fr: "Préparez-vous pour votre permis de conduire à Madagascar", mg: "Miomàna ho amin'ny fanadinana fahazoan-dàlana mitondra fiara" },
  "home.startLearning": { fr: "Commencer l'apprentissage", mg: "Manomboka mianatra" },
  "home.adminLogin": { fr: "Connexion Admin", mg: "Fidirana Mpitantana" },
  "home.categories": { fr: "Catégories", mg: "Sokajy" },
  
  // Categories
  "category.roadSigns": { fr: "Panneaux de Signalisation", mg: "Famantarana Lalana" },
  "category.traffic": { fr: "Règles de Circulation", mg: "Fitsipiky ny Fifamoivoizana" },
  "category.safety": { fr: "Sécurité Routière", mg: "Fiarovana eny an-dalana" },
  "category.vehicle": { fr: "Véhicule et Mécanique", mg: "Fiara sy Mekanika" },
  "category.priority": { fr: "Priorités", mg: "Laharam-pahamehana" },
  "category.parking": { fr: "Stationnement", mg: "Fijanonana" },
  "category.lessons": { fr: "leçons", mg: "lesona" },
  "category.questions": { fr: "questions", mg: "fanontaniana" },
  
  // Lessons
  "lesson.previous": { fr: "Précédent", mg: "Teoaloha" },
  "lesson.next": { fr: "Suivant", mg: "Manaraka" },
  "lesson.backToCategories": { fr: "Retour aux catégories", mg: "Miverina amin'ny sokajy" },
  "lesson.listen": { fr: "Écouter", mg: "Mihaino" },
  
  // Exam
  "exam.title": { fr: "Examen", mg: "Fanadinana" },
  "exam.question": { fr: "Question", mg: "Fanontaniana" },
  "exam.of": { fr: "sur", mg: "amin'ny" },
  "exam.timeLeft": { fr: "Temps restant", mg: "Fotoana sisa" },
  "exam.submit": { fr: "Soumettre", mg: "Alefa" },
  "exam.next": { fr: "Suivant", mg: "Manaraka" },
  "exam.exit": { fr: "Quitter", mg: "Mivoaka" },
  "exam.start": { fr: "Commencer l'examen", mg: "Manomboka fanadinana" },
  
  // Results
  "results.title": { fr: "Résultats de l'Examen", mg: "Valin'ny Fanadinana" },
  "results.score": { fr: "Score", mg: "Isa" },
  "results.passed": { fr: "Réussi!", mg: "Lasa!" },
  "results.failed": { fr: "Échoué", mg: "Tsy lasa" },
  "results.correct": { fr: "Correct", mg: "Marina" },
  "results.incorrect": { fr: "Incorrect", mg: "Diso" },
  "results.yourAnswer": { fr: "Votre réponse", mg: "Ny valinteninao" },
  "results.correctAnswer": { fr: "Réponse correcte", mg: "Valiny marina" },
  "results.retake": { fr: "Repasser l'examen", mg: "Miverina manao fanadinana" },
  "results.backToLessons": { fr: "Retour aux leçons", mg: "Miverina amin'ny lesona" },
  
  // Admin
  "admin.title": { fr: "Panneau d'Administration", mg: "Tontolon'ny Mpitantana" },
  "admin.lessons": { fr: "Leçons", mg: "Lesona" },
  "admin.questions": { fr: "Questions", mg: "Fanontaniana" },
  "admin.categories": { fr: "Catégories", mg: "Sokajy" },
  "admin.addNew": { fr: "Ajouter Nouveau", mg: "Hanampy Vaovao" },
  "admin.edit": { fr: "Modifier", mg: "Hanova" },
  "admin.delete": { fr: "Supprimer", mg: "Hamafa" },
  "admin.save": { fr: "Enregistrer", mg: "Tehirizina" },
  "admin.cancel": { fr: "Annuler", mg: "Aoka ihany" },
  "admin.title_field": { fr: "Titre", mg: "Lohateny" },
  "admin.content": { fr: "Contenu", mg: "Votoaty" },
  "admin.image": { fr: "Image", mg: "Sary" },
  "admin.category": { fr: "Catégorie", mg: "Sokajy" },
  "admin.correctAnswer": { fr: "Réponse correcte", mg: "Valiny marina" },
  "admin.option": { fr: "Option", mg: "Safidy" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "fr";
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
