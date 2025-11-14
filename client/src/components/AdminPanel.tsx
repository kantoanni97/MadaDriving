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
} from "@/components/ui/dialog";

export default function AdminPanel() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("lessons");
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock data - todo: remove mock functionality
  const mockLessons = [
    { id: "1", title: "Les Feux de Signalisation", category: "traffic", contentPreview: "Les feux de signalisation sont..." },
    { id: "2", title: "Priorités aux Carrefours", category: "priority", contentPreview: "Aux carrefours non signalisés..." },
  ];

  const mockQuestions = [
    { id: "1", question: "Que signifie un panneau STOP?", category: "roadSigns", correctAnswer: 1 },
    { id: "2", question: "Vitesse en agglomération?", category: "traffic", correctAnswer: 1 },
  ];

  const categories = [
    { value: "roadSigns", label: t("category.roadSigns") },
    { value: "traffic", label: t("category.traffic") },
    { value: "safety", label: t("category.safety") },
    { value: "vehicle", label: t("category.vehicle") },
    { value: "priority", label: t("category.priority") },
    { value: "parking", label: t("category.parking") },
  ];

  const handleAddNew = () => {
    setEditingItem(null);
    setShowDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
  };

  const handleSave = () => {
    console.log("Save item");
    setShowDialog(false);
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

            <div className="space-y-4">
              {mockLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold" data-testid={`text-lesson-${lesson.id}`}>
                        {lesson.title}
                      </h3>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {lesson.contentPreview}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        Catégorie: {categories.find((c) => c.value === lesson.category)?.label}
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
          </TabsContent>

          <TabsContent value="questions">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddNew} data-testid="button-add-question">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.addNew")}
              </Button>
            </div>

            <div className="space-y-4">
              {mockQuestions.map((question) => (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold" data-testid={`text-question-${question.id}`}>
                        {question.question}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        Catégorie: {categories.find((c) => c.value === question.category)?.label}
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
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Catégories Disponibles</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category) => (
                  <Card key={category.value} className="p-4">
                    <h4 className="font-medium">{category.label}</h4>
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
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t("admin.title_field")}</Label>
                <Input
                  id="title"
                  placeholder={activeTab === "lessons" ? "Titre de la leçon" : "Question"}
                  data-testid="input-title"
                />
              </div>

              <div>
                <Label htmlFor="category">{t("admin.category")}</Label>
                <Select>
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === "lessons" ? (
                <div>
                  <Label htmlFor="content">{t("admin.content")}</Label>
                  <Textarea
                    id="content"
                    placeholder="Contenu de la leçon..."
                    rows={6}
                    data-testid="textarea-content"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Options de réponse</Label>
                    {[0, 1, 2, 3].map((i) => (
                      <Input
                        key={i}
                        placeholder={`${t("admin.option")} ${i + 1}`}
                        data-testid={`input-option-${i}`}
                      />
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="correct">{t("admin.correctAnswer")}</Label>
                    <Select>
                      <SelectTrigger id="correct" data-testid="select-correct">
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
                </>
              )}

              <div>
                <Label htmlFor="image">{t("admin.image")}</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  data-testid="input-image"
                />
              </div>
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
