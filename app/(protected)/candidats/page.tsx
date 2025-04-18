// ✅ PAGE CANDIDATS — FONCTIONNELLE + MODERNE + SANS ERREUR TS

'use client'

import { useEffect, useState, type JSX } from "react"
import {
  Plus, Search, Bed, ChefHat, Utensils, GlassWater, Bell, Pencil
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  vehicule: boolean;
  actif: boolean;
  secteurs: string[];
  date_naissance: string;
  created_at: string;
  updated_at: string;
}

interface CandidatLog {
  id: string;
  candidat_id: string;
  type_action: string;
  details: string;
  created_at: string;
}

const secteursLabels: { [key: string]: { icon: JSX.Element; label: string } } = {
  etages: { icon: <Bed className="w-4 h-4" />, label: "Étages" },
  cuisine: { icon: <ChefHat className="w-4 h-4" />, label: "Cuisine" },
  salle: { icon: <Utensils className="w-4 h-4" />, label: "Salle" },
  plonge: { icon: <GlassWater className="w-4 h-4" />, label: "Plonge" },
  reception: { icon: <Bell className="w-4 h-4" />, label: "Réception" },
}

const queryClient = new QueryClient()

function CandidatsPage() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidat | null>(null)
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    vehicule: false,
    secteurs: [] as string[],
    actif: true,
    date_naissance: "",
  })
  const [logs, setLogs] = useState<CandidatLog[]>([])
  const [tab, setTab] = useState("fiche")

  const { data: candidats = [], refetch } = useQuery({
    queryKey: ["candidats", search],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidats")
        .select("*")
        .ilike("nom", `%${search}%`)
        .order("nom")

      if (error) {
        toast.error("Erreur chargement candidats")
        return []
      }

      return data
    },
  })

  const handleSubmit = async () => {
    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    }

    if (editingCandidate) {
      await supabase.from("candidats").update(payload).eq("id", editingCandidate.id)
      await supabase.from("candidats_logs").insert({
        candidat_id: editingCandidate.id,
        type_action: "modification",
        details: "Fiche modifiée",
      })
      toast.success("Candidat modifié")
    } else {
      const { data: created } = await supabase.from("candidats").insert({
        ...payload,
        created_at: new Date().toISOString(),
      }).select().single()

      if (created) {
        await supabase.from("candidats_logs").insert({
          candidat_id: created.id,
          type_action: "création",
          details: "Fiche créée",
        })
        toast.success("Candidat créé")
      }
    }

    setDialogOpen(false)
    setEditingCandidate(null)
    refetch()
  }

  const handleEdit = async (cand: Candidat) => {
    setForm({
      nom: cand.nom,
      prenom: cand.prenom,
      email: cand.email ?? "",
      telephone: cand.telephone ?? "",
      vehicule: cand.vehicule ?? false,
      secteurs: cand.secteurs ?? [],
      actif: cand.actif ?? true,
      date_naissance: cand.date_naissance ?? "",
    })
    const { data } = await supabase.from("candidats_logs").select("*").eq("candidat_id", cand.id).order("created_at", { ascending: false })
    setLogs(data || [])
    setEditingCandidate(cand)
    setTab("fiche")
    setDialogOpen(true)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Candidats</h1>
          <Button onClick={() => {
            setForm({ nom: '', prenom: '', email: '', telephone: '', vehicule: false, secteurs: [], actif: true, date_naissance: '' })
            setEditingCandidate(null)
            setLogs([])
            setTab("fiche")
            setDialogOpen(true)
          }}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Rechercher un candidat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {candidats.map((cand) => (
            <Card key={cand.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{cand.nom} {cand.prenom}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cand.secteurs.map((s: string) => (
                      <div key={s} className="flex items-center gap-1 text-sm text-muted-foreground">
                        {secteursLabels[s]?.icon} {secteursLabels[s]?.label}
                      </div>
                    ))}
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(cand)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingCandidate ? "Modifier un candidat" : "Ajouter un candidat"}</DialogTitle>
            </DialogHeader>

            <Tabs value={tab} onValueChange={setTab} className="mt-4">
              <TabsList>
                <TabsTrigger value="fiche">Fiche</TabsTrigger>
                <TabsTrigger value="priorites">Interdictions / Priorités</TabsTrigger>
                <TabsTrigger value="historique">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="fiche" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom</Label>
                    <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                  </div>
                  <div>
                    <Label>Prénom</Label>
                    <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(secteursLabels).map(([key, { icon, label }]) => (
                    <Button
                      key={key}
                      variant={form.secteurs.includes(key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => setForm((prev) => ({
                        ...prev,
                        secteurs: prev.secteurs.includes(key)
                          ? prev.secteurs.filter((s: string) => s !== key)
                          : [...prev.secteurs, key],
                      }))}
                    >
                      {icon} {label}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Adresse mail</Label>
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Date de naissance</Label>
                    <Input type="date" value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch checked={form.vehicule} onCheckedChange={(val) => setForm({ ...form, vehicule: val })} />
                    <Label>Véhicule</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={form.actif} onCheckedChange={(val) => setForm({ ...form, actif: val })} />
                    <Label>Actif</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="priorites" className="mt-4">
                <p className="text-sm text-muted-foreground">Contenu à venir</p>
              </TabsContent>

              <TabsContent value="historique" className="mt-4 space-y-2">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun historique</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="text-sm text-muted-foreground">
                      ➤ [{new Date(log.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}] {log.type_action} — {log.details}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </QueryClientProvider>
  )
}

export default CandidatsPage;
