import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Pencil, Trash2, BookOpen, HelpCircle, FolderTree } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  nameFr: string;
  nameMg: string;
  icon: string;
}

interface Lesson {
  id: string;
  categoryId: string;
  titleFr: string;
  titleMg: string;
  contentFr: string;
  contentMg: string;
  imageUrl: string | null;
  orderIndex: number;
}

interface Question {
  id: string;
  categoryId: string;
  questionFr: string;
  questionMg: string;
  imageUrl: string | null;
  option1Fr: string;
  option1Mg: string;
  option2Fr: string;
  option2Mg: string;
  option3Fr: string;
  option3Mg: string;
  option4Fr: string;
  option4Mg: string;
  correctAnswer: number;
}

export default function AdminPanel() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lessons");
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const { data: categories } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
    queryFn: async () => {
      if (!categories || categories.length === 0) return [];
      const allLessons: Lesson[] = [];
      for (const category of categories) {
        const response = await fetch(`/api/lessons/category/${category.id}`);
        const data = await response.json();
        allLessons.push(...data);
      }
      return allLessons;
    },
    enabled: !!categories && categories.length > 0,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
    queryFn: async () => {
      if (!categories || categories.length === 0) return [];
      const allQuestions: Question[] = [];
      for (const category of categories) {
        const response = await fetch(`/api/questions/category/${category.id}`);
        const data = await response.json();
        allQuestions.push(...data);
      }
      return allQuestions;
    },
    enabled: !!categories && categories.length > 0,
  });

  const createLessonMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/lessons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      toast({ title: "Leçon créée avec succès" });
      setShowDialog(false);
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/lessons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      toast({ title: "Leçon mise à jour avec succès" });
      setShowDialog(false);
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      toast({ title: "Leçon supprimée avec succès" });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({ title: "Question créée avec succès" });
      setShowDialog(false);
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({ title: "Question mise à jour avec succès" });
      setShowDialog(false);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({ title: "Question supprimée avec succès" });
    },
  });

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({});
    setShowDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (activeTab === "lessons") {
      deleteLessonMutation.mutate(id);
    } else if (activeTab === "questions") {
      deleteQuestionMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (activeTab === "lessons") {
      const lessonData = {
        categoryId: formData.categoryId,
        titleFr: formData.titleFr || "",
        titleMg: formData.titleMg || "",
        contentFr: formData.contentFr || "",
        contentMg: formData.contentMg || "",
        imageUrl: formData.imageUrl || null,
        orderIndex: formData.orderIndex || 0,
      };

      if (editingItem) {
        updateLessonMutation.mutate({ id: editingItem.id, data: lessonData });
      } else {
        createLessonMutation.mutate(lessonData);
      }
    } else if (activeTab === "questions") {
      const questionData = {
        categoryId: formData.categoryId,
        questionFr: formData.questionFr || "",
        questionMg: formData.questionMg || "",
        imageUrl: formData.imageUrl || null,
        option1Fr: formData.option1Fr || "",
        option1Mg: formData.option1Mg || "",
        option2Fr: formData.option2Fr || "",
        option2Mg: formData.option2Mg || "",
        option3Fr: formData.option3Fr || "",
        option3Mg: formData.option3Mg || "",
        option4Fr: formData.option4Fr || "",
        option4Mg: formData.option4Mg || "",
        correctAnswer: parseInt(formData.correctAnswer) || 0,
      };

      if (editingItem) {
        updateQuestionMutation.mutate({ id: editingItem.id, data: questionData });
      } else {
        createQuestionMutation.mutate(questionData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold" data-testid="text-admin-title">
            {t("admin.title")}
          </h1>
          <p className="text-muted-foreground">Gérer les leçons, questions et catégories</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="lessons" data-testid="tab-lessons">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("admin.lessons")}
            </TabsTrigger>
            <TabsTrigger value="questions" data-testid="tab-questions">
              <HelpCircle className="mr-2 h-4 w-4" />
              {t("admin.questions")}
            </TabsTrigger>
            <TabsTrigger value="categories" data-testid="tab-categories">
              <FolderTree className="mr-2 h-4 w-4" />
              {t("admin.categories")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddNew} data-testid="button-add-lesson">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.addNew")}
              </Button>
            </div>

            {lessonsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lessons?.map((lesson) => (
                  <Card key={lesson.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold" data-testid={`text-lesson-${lesson.id}`}>
                          {lesson.titleFr} / {lesson.titleMg}
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                          {lesson.contentFr.substring(0, 100)}...
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Catégorie: {categories?.find((c) => c.id === lesson.categoryId)?.nameFr}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(lesson)}
                          data-testid={`button-edit-lesson-${lesson.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(lesson.id)}
                          data-testid={`button-delete-lesson-${lesson.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddNew} data-testid="button-add-question">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.addNew")}
              </Button>
            </div>

            {questionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {questions?.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold" data-testid={`text-question-${question.id}`}>
                          {question.questionFr}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          Catégorie: {categories?.find((c) => c.id === question.categoryId)?.nameFr}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(question)}
                          data-testid={`button-edit-question-${question.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(question.id)}
                          data-testid={`button-delete-question-${question.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Catégories Disponibles</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {categories?.map((category) => (
                  <Card key={category.id} className="p-4">
                    <h4 className="font-medium">{category.nameFr} / {category.nameMg}</h4>
                    <p className="text-sm text-muted-foreground">Icon: {category.icon}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? t("admin.edit") : t("admin.addNew")}{" "}
                {activeTab === "lessons" ? t("admin.lessons") : t("admin.questions")}
              </DialogTitle>
              <DialogDescription>
                {activeTab === "lessons"
                  ? "Remplissez les informations de la leçon en français et malagasy"
                  : "Remplissez les informations de la question avec 4 options"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">{t("admin.category")}</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nameFr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === "lessons" ? (
                <>
                  <div>
                    <Label htmlFor="titleFr">Titre (Français)</Label>
                    <Input
                      id="titleFr"
                      value={formData.titleFr || ""}
                      onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                      data-testid="input-title-fr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleMg">Titre (Malagasy)</Label>
                    <Input
                      id="titleMg"
                      value={formData.titleMg || ""}
                      onChange={(e) => setFormData({ ...formData, titleMg: e.target.value })}
                      data-testid="input-title-mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentFr">Contenu (Français)</Label>
                    <Textarea
                      id="contentFr"
                      value={formData.contentFr || ""}
                      onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                      rows={4}
                      data-testid="textarea-content-fr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentMg">Contenu (Malagasy)</Label>
                    <Textarea
                      id="contentMg"
                      value={formData.contentMg || ""}
                      onChange={(e) => setFormData({ ...formData, contentMg: e.target.value })}
                      rows={4}
                      data-testid="textarea-content-mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">URL de l'image</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl || ""}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/attached_assets/..."
                      data-testid="input-image-url"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="questionFr">Question (Français)</Label>
                    <Input
                      id="questionFr"
                      value={formData.questionFr || ""}
                      onChange={(e) => setFormData({ ...formData, questionFr: e.target.value })}
                      data-testid="input-question-fr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="questionMg">Question (Malagasy)</Label>
                    <Input
                      id="questionMg"
                      value={formData.questionMg || ""}
                      onChange={(e) => setFormData({ ...formData, questionMg: e.target.value })}
                      data-testid="input-question-mg"
                    />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <Label>Option 1 (FR)</Label>
                      <Input
                        value={formData.option1Fr || ""}
                        onChange={(e) => setFormData({ ...formData, option1Fr: e.target.value })}
                        data-testid="input-option1-fr"
                      />
                    </div>
                    <div>
                      <Label>Option 1 (MG)</Label>
                      <Input
                        value={formData.option1Mg || ""}
                        onChange={(e) => setFormData({ ...formData, option1Mg: e.target.value })}
                        data-testid="input-option1-mg"
                      />
                    </div>
                    <div>
                      <Label>Option 2 (FR)</Label>
                      <Input
                        value={formData.option2Fr || ""}
                        onChange={(e) => setFormData({ ...formData, option2Fr: e.target.value })}
                        data-testid="input-option2-fr"
                      />
                    </div>
                    <div>
                      <Label>Option 2 (MG)</Label>
                      <Input
                        value={formData.option2Mg || ""}
                        onChange={(e) => setFormData({ ...formData, option2Mg: e.target.value })}
                        data-testid="input-option2-mg"
                      />
                    </div>
                    <div>
                      <Label>Option 3 (FR)</Label>
                      <Input
                        value={formData.option3Fr || ""}
                        onChange={(e) => setFormData({ ...formData, option3Fr: e.target.value })}
                        data-testid="input-option3-fr"
                      />
                    </div>
                    <div>
                      <Label>Option 3 (MG)</Label>
                      <Input
                        value={formData.option3Mg || ""}
                        onChange={(e) => setFormData({ ...formData, option3Mg: e.target.value })}
                        data-testid="input-option3-mg"
                      />
                    </div>
                    <div>
                      <Label>Option 4 (FR)</Label>
                      <Input
                        value={formData.option4Fr || ""}
                        onChange={(e) => setFormData({ ...formData, option4Fr: e.target.value })}
                        data-testid="input-option4-fr"
                      />
                    </div>
                    <div>
                      <Label>Option 4 (MG)</Label>
                      <Input
                        value={formData.option4Mg || ""}
                        onChange={(e) => setFormData({ ...formData, option4Mg: e.target.value })}
                        data-testid="input-option4-mg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="correctAnswer">{t("admin.correctAnswer")}</Label>
                    <Select
                      value={formData.correctAnswer?.toString()}
                      onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}
                    >
                      <SelectTrigger id="correctAnswer" data-testid="select-correct">
                        <SelectValue placeholder="Sélectionner la bonne réponse" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3].map((i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {t("admin.option")} {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl || ""}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/attached_assets/..."
                      data-testid="input-image-url"
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                data-testid="button-cancel"
              >
                {t("admin.cancel")}
              </Button>
              <Button onClick={handleSave} data-testid="button-save">
                {t("admin.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
