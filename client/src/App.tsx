import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Home from "@/pages/home";
import CategoryLessons from "@/pages/category-lessons";
import Exam from "@/pages/exam";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import ExamBlanc from "@/pages/exam-blanc";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:categoryId" component={CategoryLessons} />
      <Route path="/exam/:categoryId" component={Exam} />
      <Route path="/exam-blanc" component={ExamBlanc} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <Router />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
