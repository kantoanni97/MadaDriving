import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Trash2, TrendingUp, Award, Target, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface UserStats {
  totalExams: number;
  passedExams: number;
  averageScore: number;
}

export default function StudentsManagement() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: selectedUserStats } = useQuery<UserStats>({
    queryKey: [`/api/users/${selectedUserId}/stats`],
    enabled: !!selectedUserId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: language === "fr" ? "Utilisateur supprimé" : "Mpampiasa voafafa",
        description: language === "fr" ? "L'utilisateur a été supprimé avec succès" : "Voafafa soa aman-tsara ny mpampiasa",
      });
      setDeleteUserId(null);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: language === "fr" ? "Erreur" : "Fahadisoana",
        description: language === "fr" ? "Impossible de supprimer l'utilisateur" : "Tsy afaka mamafa ny mpampiasa",
      });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "mg-MG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const students = users?.filter(u => u.role === "student") || [];

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              {language === "fr" ? "Gestion des Étudiants" : "Fitantanana ny Mpianatra"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "fr" 
                ? `${students.length} étudiant(s) inscrit(s)`
                : `Mpianatra ${students.length} voasoratra anarana`}
            </p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/admin-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "fr" ? "Retour" : "Miverina"}
          </Button>
        </div>

        {students.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {language === "fr"
                ? "Aucun étudiant inscrit pour le moment."
                : "Tsy mbola misy mpianatra voasoratra anarana."}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {students.map((student) => (
              <Card key={student.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{student.name}</h3>
                      <span className="text-sm text-muted-foreground">{student.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Inscrit le" : "Nisoratra anarana ny"} {formatDate(student.createdAt)}
                    </p>

                    {selectedUserId === student.id && selectedUserStats && (
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === "fr" ? "Examens passés" : "Fanadinana vita"}
                            </p>
                            <p className="text-lg font-bold">{selectedUserStats.totalExams}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Award className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === "fr" ? "Examens réussis" : "Fanadinana nahomby"}
                            </p>
                            <p className="text-lg font-bold">{selectedUserStats.passedExams}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === "fr" ? "Score moyen" : "Isa antonony"}
                            </p>
                            <p className="text-lg font-bold">{selectedUserStats.averageScore}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUserId(selectedUserId === student.id ? null : student.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedUserId === student.id
                        ? language === "fr" ? "Masquer" : "Afenina"
                        : language === "fr" ? "Voir stats" : "Hijery isa"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteUserId(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === "fr" ? "Confirmer la suppression" : "Hanamarina ny famafana"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === "fr"
                  ? "Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible et supprimera tous ses résultats d'examens."
                  : "Azo antoka ve fa te hamafa io mpianatra io? Tsy azo averina izany ary hofafana ny valin'ny fanadinana rehetra."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {language === "fr" ? "Annuler" : "Aoka ihany"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteUserId && deleteMutation.mutate(deleteUserId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {language === "fr" ? "Supprimer" : "Fafao"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}