import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Home from "@/pages/home";
import CategoryLessons from "@/pages/category-lessons";
import Exam from "@/pages/exam";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import ExamBlanc from "@/pages/exam-blanc";
import Auth from "@/pages/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentDashboard from "@/pages/student-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import StudentsManagement from "@/pages/students-management";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />

      <Route path="/profile">
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
</Route>
      
      <Route path="/students-management">
  <ProtectedRoute requireAdmin={true}>
    <StudentsManagement />
  </ProtectedRoute>
</Route>
      
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      
      <Route path="/category/:categoryId">
        <ProtectedRoute>
          <CategoryLessons />
        </ProtectedRoute>
      </Route>
      
      <Route path="/exam/:categoryId">
        <ProtectedRoute>
          <Exam />
        </ProtectedRoute>
      </Route>
      
      <Route path="/exam-blanc">
        <ProtectedRoute>
          <ExamBlanc />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin-dashboard">
  <ProtectedRoute requireAdmin={true}>
    <AdminDashboard />
  </ProtectedRoute>
</Route>
      
      <Route path="/admin">
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      </Route>
      
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
          <AuthProvider> 
            <div className="min-h-screen bg-background">
              <Header />
              <Router />
            </div>
            <Toaster />
            </AuthProvider> 
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
