import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ChevronLeft, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────

interface Evento {
  id: string;
  destino: string;
  titulo: string;
  slug: string;
  descricao_curta: string | null;
  descricao_longa: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  prioridade: number;
  cor_hex: string | null;
  hero_media_url: string | null;
  botao_label: string | null;
  botao_link: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface EventoItem {
  id: string;
  evento_id: string;
  tipo: string;
  titulo: string;
  slug: string;
  data_inicio: string | null;
  data_fim: string | null;
  bairro: string | null;
  local_nome: string | null;
  google_maps_url: string | null;
  instagram: string | null;
  descricao: string | null;
  tags: string[];
  ordem: number;
  ativo: boolean;
}

type EventoForm = Omit<Evento, "id" | "created_at" | "updated_at">;
type EventoItemForm = Omit<EventoItem, "id">;

const emptyEvento: EventoForm = {
  destino: "rio-de-janeiro",
  titulo: "",
  slug: "",
  descricao_curta: "",
  descricao_longa: "",
  data_inicio: null,
  data_fim: null,
  prioridade: 0,
  cor_hex: "",
  hero_media_url: "",
  botao_label: "",
  botao_link: "",
  ativo: false,
};

const emptyItem = (eventoId: string): EventoItemForm => ({
  evento_id: eventoId,
  tipo: "atividade",
  titulo: "",
  slug: "",
  data_inicio: null,
  data_fim: null,
  bairro: "",
  local_nome: "",
  google_maps_url: "",
  instagram: "",
  descricao: "",
  tags: [],
  ordem: 0,
  ativo: true,
});

// ─── Slug helper ─────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Login Form ──────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro no login", description: error.message, variant: "destructive" });
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-foreground text-center">Admin — Login</h1>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" /> Entrar</>}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────

const AdminEventos = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading, userId } = useAdminAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Dialogs
  const [eventoDialog, setEventoDialog] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [form, setForm] = useState<EventoForm>(emptyEvento);

  // Items
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [items, setItems] = useState<EventoItem[]>([]);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<EventoItem | null>(null);
  const [itemForm, setItemForm] = useState<EventoItemForm>(emptyItem(""));
  const [tagsInput, setTagsInput] = useState("");

  // ─── Data fetching ─────────────────────────────────────────────

  const fetchEventos = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("eventos")
      .select("*")
      .order("prioridade", { ascending: false });
    setEventos((data as Evento[]) || []);
    setLoadingData(false);
  };

  const fetchItems = async (eventoId: string) => {
    const { data } = await supabase
      .from("evento_itens")
      .select("*")
      .eq("evento_id", eventoId)
      .order("ordem", { ascending: true });
    setItems((data as EventoItem[]) || []);
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (isAdmin && userId) fetchEventos();
  }, [isAdmin, userId]);

  // ─── Auth gate ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userId) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">Acesso negado</p>
          <p className="text-sm text-muted-foreground">Você não tem permissão de admin.</p>
          <Button variant="outline" onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  // ─── Evento CRUD ───────────────────────────────────────────────

  const openCreateEvento = () => {
    setEditingEvento(null);
    setForm(emptyEvento);
    setEventoDialog(true);
  };

  const openEditEvento = (e: Evento) => {
    setEditingEvento(e);
    setForm({
      destino: e.destino,
      titulo: e.titulo,
      slug: e.slug,
      descricao_curta: e.descricao_curta || "",
      descricao_longa: e.descricao_longa || "",
      data_inicio: e.data_inicio,
      data_fim: e.data_fim,
      prioridade: e.prioridade,
      cor_hex: e.cor_hex || "",
      hero_media_url: e.hero_media_url || "",
      botao_label: e.botao_label || "",
      botao_link: e.botao_link || "",
      ativo: e.ativo,
    });
    setEventoDialog(true);
  };

  const saveEvento = async () => {
    const payload = {
      ...form,
      descricao_curta: form.descricao_curta || null,
      descricao_longa: form.descricao_longa || null,
      cor_hex: form.cor_hex || null,
      hero_media_url: form.hero_media_url || null,
      botao_label: form.botao_label || null,
      botao_link: form.botao_link || null,
    };

    if (editingEvento) {
      const { error } = await supabase.from("eventos").update(payload).eq("id", editingEvento.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Evento atualizado" });
    } else {
      const { error } = await supabase.from("eventos").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Evento criado" });
    }
    setEventoDialog(false);
    fetchEventos();
  };

  const toggleEvento = async (e: Evento) => {
    await supabase.from("eventos").update({ ativo: !e.ativo }).eq("id", e.id);
    fetchEventos();
  };

  const deleteEvento = async (e: Evento) => {
    if (!confirm(`Excluir "${e.titulo}"?`)) return;
    await supabase.from("eventos").delete().eq("id", e.id);
    toast({ title: "Evento excluído" });
    if (selectedEvento?.id === e.id) setSelectedEvento(null);
    fetchEventos();
  };

  // ─── Item CRUD ─────────────────────────────────────────────────

  const openManageItems = (e: Evento) => {
    setSelectedEvento(e);
    fetchItems(e.id);
  };

  const openCreateItem = () => {
    if (!selectedEvento) return;
    setEditingItem(null);
    setItemForm(emptyItem(selectedEvento.id));
    setTagsInput("");
    setItemDialog(true);
  };

  const openEditItem = (item: EventoItem) => {
    setEditingItem(item);
    setItemForm({ ...item });
    setTagsInput(item.tags?.join(", ") || "");
    setItemDialog(true);
  };

  const saveItem = async () => {
    const payload = {
      ...itemForm,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      bairro: itemForm.bairro || null,
      local_nome: itemForm.local_nome || null,
      google_maps_url: itemForm.google_maps_url || null,
      instagram: itemForm.instagram || null,
      descricao: itemForm.descricao || null,
    };

    if (editingItem) {
      const { id, ...rest } = payload as any;
      const { error } = await supabase.from("evento_itens").update(rest).eq("id", editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item atualizado" });
    } else {
      const { error } = await supabase.from("evento_itens").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item criado" });
    }
    setItemDialog(false);
    if (selectedEvento) fetchItems(selectedEvento.id);
  };

  const deleteItem = async (item: EventoItem) => {
    if (!confirm(`Excluir "${item.titulo}"?`)) return;
    await supabase.from("evento_itens").delete().eq("id", item.id);
    toast({ title: "Item excluído" });
    if (selectedEvento) fetchItems(selectedEvento.id);
  };

  // ─── Render ────────────────────────────────────────────────────

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("pt-BR") : "—";

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-50 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 -m-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Admin — Eventos</h1>
        </div>
        <Button size="sm" onClick={openCreateEvento}>
          <Plus className="w-4 h-4 mr-1" /> Novo Evento
        </Button>
      </header>

      <main className="px-4 py-6 space-y-4 max-w-4xl mx-auto">
        {loadingData ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : eventos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum evento cadastrado.</p>
        ) : (
          eventos.map((e) => (
            <div key={e.id} className="p-4 bg-card border border-border rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{e.titulo}</h3>
                  <p className="text-xs text-muted-foreground">{e.destino} · {formatDate(e.data_inicio)} → {formatDate(e.data_fim)} · Prioridade: {e.prioridade}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Switch checked={e.ativo} onCheckedChange={() => toggleEvento(e)} />
                  <span className={`text-xs font-medium ${e.ativo ? "text-green-600" : "text-muted-foreground"}`}>
                    {e.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditEvento(e)}>
                  <Pencil className="w-3 h-3 mr-1" /> Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => openManageItems(e)}>
                  Itens
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteEvento(e)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Excluir
                </Button>
              </div>
            </div>
          ))
        )}

        {/* ── Items Panel ── */}
        {selectedEvento && (
          <div className="mt-8 p-4 bg-muted/30 border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Itens — {selectedEvento.titulo}</h2>
              <Button size="sm" onClick={openCreateItem}><Plus className="w-4 h-4 mr-1" /> Item</Button>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum item.</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.titulo}</p>
                      <p className="text-xs text-muted-foreground">{item.tipo} · {item.bairro || "—"} · Ordem: {item.ordem}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => openEditItem(item)}><Pencil className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteItem(item)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Evento Dialog ── */}
      <Dialog open={eventoDialog} onOpenChange={setEventoDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvento ? "Editar Evento" : "Novo Evento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Destino</Label>
              <Input value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} />
            </div>
            <div>
              <Label>Título</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value, slug: editingEvento ? form.slug : toSlug(e.target.value) })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <Label>Descrição curta</Label>
              <Textarea value={form.descricao_curta || ""} onChange={(e) => setForm({ ...form, descricao_curta: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Descrição longa</Label>
              <Textarea value={form.descricao_longa || ""} onChange={(e) => setForm({ ...form, descricao_longa: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data início</Label>
                <Input type="date" value={form.data_inicio?.slice(0, 10) || ""} onChange={(e) => setForm({ ...form, data_inicio: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
              <div>
                <Label>Data fim</Label>
                <Input type="date" value={form.data_fim?.slice(0, 10) || ""} onChange={(e) => setForm({ ...form, data_fim: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Prioridade</Label>
                <Input type="number" value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Cor hex</Label>
                <Input placeholder="#FF6B00" value={form.cor_hex || ""} onChange={(e) => setForm({ ...form, cor_hex: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Hero media URL</Label>
              <Input value={form.hero_media_url || ""} onChange={(e) => setForm({ ...form, hero_media_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Botão label</Label>
                <Input value={form.botao_label || ""} onChange={(e) => setForm({ ...form, botao_label: e.target.value })} />
              </div>
              <div>
                <Label>Botão link</Label>
                <Input value={form.botao_link || ""} onChange={(e) => setForm({ ...form, botao_link: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} />
              <Label>Ativo</Label>
            </div>
            <Button className="w-full" onClick={saveEvento}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Item Dialog ── */}
      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Item" : "Novo Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Tipo</Label>
              <Select value={itemForm.tipo} onValueChange={(v) => setItemForm({ ...itemForm, tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["bloco", "festa", "desfile", "show", "atividade"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título</Label>
              <Input value={itemForm.titulo} onChange={(e) => setItemForm({ ...itemForm, titulo: e.target.value, slug: editingItem ? itemForm.slug : toSlug(e.target.value) })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={itemForm.slug} onChange={(e) => setItemForm({ ...itemForm, slug: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data início</Label>
                <Input type="datetime-local" value={itemForm.data_inicio?.slice(0, 16) || ""} onChange={(e) => setItemForm({ ...itemForm, data_inicio: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
              <div>
                <Label>Data fim</Label>
                <Input type="datetime-local" value={itemForm.data_fim?.slice(0, 16) || ""} onChange={(e) => setItemForm({ ...itemForm, data_fim: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Bairro</Label>
                <Input value={itemForm.bairro || ""} onChange={(e) => setItemForm({ ...itemForm, bairro: e.target.value })} />
              </div>
              <div>
                <Label>Local nome</Label>
                <Input value={itemForm.local_nome || ""} onChange={(e) => setItemForm({ ...itemForm, local_nome: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Google Maps URL</Label>
              <Input value={itemForm.google_maps_url || ""} onChange={(e) => setItemForm({ ...itemForm, google_maps_url: e.target.value })} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input value={itemForm.instagram || ""} onChange={(e) => setItemForm({ ...itemForm, instagram: e.target.value })} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={itemForm.descricao || ""} onChange={(e) => setItemForm({ ...itemForm, descricao: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Tags (separadas por vírgula)</Label>
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="samba, rua, grátis" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ordem</Label>
                <Input type="number" value={itemForm.ordem} onChange={(e) => setItemForm({ ...itemForm, ordem: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={itemForm.ativo} onCheckedChange={(v) => setItemForm({ ...itemForm, ativo: v })} />
                <Label>Ativo</Label>
              </div>
            </div>
            <Button className="w-full" onClick={saveItem}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEventos;
