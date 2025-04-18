'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Users, Building, Shirt, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Parametrage {
  id: string;
  valeur: string;
  description?: string;
  categorie: 'service' | 'groupe' | 'tenue';
  created_at: string;
  updated_at: string;
}

interface Utilisateur {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export default function ParametragesPage() {
  // Data lists
  const [services, setServices] = useState<Parametrage[]>([]);
  const [groupes, setGroupes] = useState<Parametrage[]>([]);
  const [tenues, setTenues] = useState<Parametrage[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);

  // Add modal states
  const [isServiceAddOpen, setIsServiceAddOpen] = useState(false);
  const [isGroupAddOpen, setIsGroupAddOpen] = useState(false);
  const [isTenueAddOpen, setIsTenueAddOpen] = useState(false);
  const [isUserAddOpen, setIsUserAddOpen] = useState(false);

  // Edit modal states
  const [serviceEdit, setServiceEdit] = useState<Parametrage | null>(null);
  const [groupEdit, setGroupEdit] = useState<Parametrage | null>(null);
  const [tenueEdit, setTenueEdit] = useState<Parametrage | null>(null);
  const [userEdit, setUserEdit] = useState<Utilisateur | null>(null);

  // Fields for adding entities
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const [newTenueName, setNewTenueName] = useState("");
  const [newTenueDescription, setNewTenueDescription] = useState("");

  const [newUserPrenom, setNewUserPrenom] = useState("");
  const [newUserNom, setNewUserNom] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  useEffect(() => {
    Promise.all([
      fetchServices(),
      fetchGroupes(),
      fetchTenues(),
      fetchUtilisateurs(),
    ]);
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("parametrages")
      .select("*")
      .eq("categorie", "service")
      .order("valeur");
    if (error) {
      toast.error("Erreur chargement services : " + error.message);
      return;
    }
    setServices(data || []);
  };

  const fetchGroupes = async () => {
    const { data, error } = await supabase
      .from("parametrages")
      .select("*")
      .eq("categorie", "groupe")
      .order("valeur");
    if (error) {
      toast.error("Erreur chargement groupes : " + error.message);
      return;
    }
    setGroupes(data || []);
  };

  const fetchTenues = async () => {
    const { data, error } = await supabase
      .from("parametrages")
      .select("*")
      .eq("categorie", "tenue")
      .order("valeur");
    if (error) {
      toast.error("Erreur chargement tenues : " + error.message);
      return;
    }
    setTenues(data || []);
  };

  const fetchUtilisateurs = async () => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*");
    if (error) {
      toast.error("Erreur chargement utilisateurs : " + error.message);
      return;
    }
    setUtilisateurs(data || []);
  };

  // Handlers for additions
  const handleAddService = async () => {
    if (!newServiceName.trim()) {
      toast.error("Nom du service requis");
      return;
    }
    const { error } = await supabase.from("parametrages").insert({
      categorie: "service",
      valeur: newServiceName.trim(),
      description: newServiceDescription.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) {
      toast.error("Erreur ajout service : " + error.message);
      return;
    }
    toast.success("Service ajouté");
    setIsServiceAddOpen(false);
    setNewServiceName("");
    setNewServiceDescription("");
    fetchServices();
  };

  const handleAddGroupe = async () => {
    if (!newGroupName.trim()) {
      toast.error("Nom du groupe requis");
      return;
    }
    const { error } = await supabase.from("parametrages").insert({
      categorie: "groupe",
      valeur: newGroupName.trim(),
      description: newGroupDescription.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) {
      toast.error("Erreur ajout groupe : " + error.message);
      return;
    }
    toast.success("Groupe ajouté");
    setIsGroupAddOpen(false);
    setNewGroupName("");
    setNewGroupDescription("");
    fetchGroupes();
  };

  const handleAddTenue = async () => {
    if (!newTenueName.trim()) {
      toast.error("Nom de la tenue requis");
      return;
    }
    const { error } = await supabase.from("parametrages").insert({
      categorie: "tenue",
      valeur: newTenueName.trim(),
      description: newTenueDescription.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) {
      toast.error("Erreur ajout tenue : " + error.message);
      return;
    }
    toast.success("Tenue ajoutée");
    setIsTenueAddOpen(false);
    setNewTenueName("");
    setNewTenueDescription("");
    fetchTenues();
  };

  const handleAddUser = async () => {
    if (
      !newUserPrenom.trim() ||
      !newUserNom.trim() ||
      !newUserEmail.trim() ||
      !newUserPassword.trim()
    ) {
      toast.error("Tous les champs sont requis pour l'utilisateur");
      return;
    }
    const { error } = await supabase.from("utilisateurs").insert({
      prenom: newUserPrenom.trim(),
      nom: newUserNom.trim(),
      email: newUserEmail.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) {
      toast.error("Erreur ajout utilisateur : " + error.message);
      return;
    }
    toast.success("Utilisateur ajouté");
    setIsUserAddOpen(false);
    setNewUserPrenom("");
    setNewUserNom("");
    setNewUserEmail("");
    setNewUserPassword("");
    fetchUtilisateurs();
  };

  // Handlers for updates
  const handleUpdateService = async () => {
    if (!serviceEdit || !serviceEdit.valeur.trim()) {
      toast.error("Nom du service requis");
      return;
    }
    const { error } = await supabase.from("parametrages").update({
      valeur: serviceEdit.valeur.trim(),
      description: serviceEdit.description?.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", serviceEdit.id);
    if (error) {
      toast.error("Erreur modification service : " + error.message);
      return;
    }
    toast.success("Service modifié");
    setServiceEdit(null);
    fetchServices();
  };

  const handleUpdateGroupe = async () => {
    if (!groupEdit || !groupEdit.valeur.trim()) {
      toast.error("Nom du groupe requis");
      return;
    }
    const { error } = await supabase.from("parametrages").update({
      valeur: groupEdit.valeur.trim(),
      description: groupEdit.description?.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", groupEdit.id);
    if (error) {
      toast.error("Erreur modification groupe : " + error.message);
      return;
    }
    toast.success("Groupe modifié");
    setGroupEdit(null);
    fetchGroupes();
  };

  const handleUpdateTenue = async () => {
    if (!tenueEdit || !tenueEdit.valeur.trim()) {
      toast.error("Nom de la tenue requis");
      return;
    }
    const { error } = await supabase.from("parametrages").update({
      valeur: tenueEdit.valeur.trim(),
      description: tenueEdit.description?.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", tenueEdit.id);
    if (error) {
      toast.error("Erreur modification tenue : " + error.message);
      return;
    }
    toast.success("Tenue modifiée");
    setTenueEdit(null);
    fetchTenues();
  };

  const handleUpdateUser = async () => {
    if (!userEdit || !userEdit.prenom.trim() || !userEdit.nom.trim() || !userEdit.email.trim()) {
      toast.error("Tous les champs sont requis pour l'utilisateur");
      return;
    }
    const { error } = await supabase.from("utilisateurs").update({
      prenom: userEdit.prenom.trim(),
      nom: userEdit.nom.trim(),
      email: userEdit.email.trim(),
      updated_at: new Date().toISOString(),
    }).eq("id", userEdit.id);
    if (error) {
      toast.error("Erreur modification utilisateur : " + error.message);
      return;
    }
    toast.success("Utilisateur modifié");
    setUserEdit(null);
    fetchUtilisateurs();
  };

  // Common handler for deletion
  const handleDeleteEntity = async (entity: 'service' | 'groupe' | 'tenue' | 'utilisateur', id: string) => {
    if (entity === "utilisateur") {
      const { error } = await supabase.from("utilisateurs").delete().eq("id", id);
      if (error) {
        toast.error("Erreur suppression utilisateur : " + error.message);
        return;
      }
      toast.success("Utilisateur supprimé");
      fetchUtilisateurs();
    } else {
      const { error } = await supabase.from("parametrages").delete().eq("id", id);
      if (error) {
        toast.error("Erreur suppression " + entity + " : " + error.message);
        return;
      }
      toast.success(entity.charAt(0).toUpperCase() + entity.slice(1) + " supprimé");
      if (entity === "service") fetchServices();
      if (entity === "groupe") fetchGroupes();
      if (entity === "tenue") fetchTenues();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Paramétrages</h1>
      <Tabs defaultValue="services">
        <TabsList className="mb-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="groupes">Groupes</TabsTrigger>
          <TabsTrigger value="tenues">Tenues</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
        </TabsList>

        {/* Onglet Services */}
        <TabsContent value="services">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Services</CardTitle>
              <Button onClick={() => setIsServiceAddOpen(true)}>Ajouter</Button>
            </CardHeader>
            <CardContent>
              {services.map((item) => (
                <div key={item.id} className="flex justify-between border-b py-2">
                  <span>{item.valeur}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setServiceEdit(item)}>Modifier</Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => handleDeleteEntity('service', item.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Groupes */}
        <TabsContent value="groupes">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Groupes</CardTitle>
              <Button onClick={() => setIsGroupAddOpen(true)}>Ajouter</Button>
            </CardHeader>
            <CardContent>
              {groupes.map((item) => (
                <div key={item.id} className="flex justify-between border-b py-2">
                  <span>{item.valeur}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setGroupEdit(item)}>Modifier</Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => handleDeleteEntity('groupe', item.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tenues */}
        <TabsContent value="tenues">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Tenues</CardTitle>
              <Button onClick={() => setIsTenueAddOpen(true)}>Ajouter</Button>
            </CardHeader>
            <CardContent>
              {tenues.map((item) => (
                <div key={item.id} className="flex justify-between border-b py-2">
                  <div>
                    <div className="font-medium">{item.valeur}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setTenueEdit(item)}>Modifier</Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => handleDeleteEntity('tenue', item.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Utilisateurs */}
        <TabsContent value="utilisateurs">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Utilisateurs</CardTitle>
              <Button onClick={() => setIsUserAddOpen(true)}>Ajouter</Button>
            </CardHeader>
            <CardContent>
              {utilisateurs.map((user) => (
                <div key={user.id} className="flex justify-between border-b py-2">
                  <div>
                    <div>{user.prenom} {user.nom}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setUserEdit(user)}>Modifier</Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => handleDeleteEntity('utilisateur', user.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---------- Modals ---------- */}

      {/* Modal Ajout Service */}
      <Dialog open={isServiceAddOpen} onOpenChange={setIsServiceAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un service</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom du service</Label>
            <Input value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} />
            <Label>Description (optionnel)</Label>
            <Input value={newServiceDescription} onChange={(e) => setNewServiceDescription(e.target.value)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleAddService}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edition Service */}
      <Dialog open={!!serviceEdit} onOpenChange={(open) => { if (!open) setServiceEdit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le service</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom du service</Label>
            <Input value={serviceEdit?.valeur || ""} onChange={(e) => setServiceEdit(serviceEdit ? { ...serviceEdit, valeur: e.target.value } : null)} />
            <Label>Description (optionnel)</Label>
            <Input value={serviceEdit?.description || ""} onChange={(e) => setServiceEdit(serviceEdit ? { ...serviceEdit, description: e.target.value } : null)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateService}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ajout Groupe */}
      <Dialog open={isGroupAddOpen} onOpenChange={setIsGroupAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un groupe</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom du groupe</Label>
            <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
            <Label>Description (optionnel)</Label>
            <Input value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleAddGroupe}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edition Groupe */}
      <Dialog open={!!groupEdit} onOpenChange={(open) => { if (!open) setGroupEdit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le groupe</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom du groupe</Label>
            <Input value={groupEdit?.valeur || ""} onChange={(e) => setGroupEdit(groupEdit ? { ...groupEdit, valeur: e.target.value } : null)} />
            <Label>Description (optionnel)</Label>
            <Input value={groupEdit?.description || ""} onChange={(e) => setGroupEdit(groupEdit ? { ...groupEdit, description: e.target.value } : null)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateGroupe}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ajout Tenue */}
      <Dialog open={isTenueAddOpen} onOpenChange={setIsTenueAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une tenue</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom de la tenue</Label>
            <Input value={newTenueName} onChange={(e) => setNewTenueName(e.target.value)} />
            <Label>Description (optionnel)</Label>
            <Input value={newTenueDescription} onChange={(e) => setNewTenueDescription(e.target.value)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleAddTenue}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edition Tenue */}
      <Dialog open={!!tenueEdit} onOpenChange={(open) => { if (!open) setTenueEdit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tenue</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom de la tenue</Label>
            <Input value={tenueEdit?.valeur || ""} onChange={(e) => setTenueEdit(tenueEdit ? { ...tenueEdit, valeur: e.target.value } : null)} />
            <Label>Description (optionnel)</Label>
            <Input value={tenueEdit?.description || ""} onChange={(e) => setTenueEdit(tenueEdit ? { ...tenueEdit, description: e.target.value } : null)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateTenue}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ajout Utilisateur */}
      <Dialog open={isUserAddOpen} onOpenChange={setIsUserAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Prénom</Label>
            <Input value={newUserPrenom} onChange={(e) => setNewUserPrenom(e.target.value)} />
            <Label>Nom</Label>
            <Input value={newUserNom} onChange={(e) => setNewUserNom(e.target.value)} />
            <Label>Email</Label>
            <Input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
            <Label>Mot de passe</Label>
            <Input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleAddUser}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edition Utilisateur */}
      <Dialog open={!!userEdit} onOpenChange={(open) => { if (!open) { setUserEdit(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Prénom</Label>
            <Input value={userEdit?.prenom || ""} onChange={(e) => setUserEdit(userEdit ? { ...userEdit, prenom: e.target.value } : null)} />
            <Label>Nom</Label>
            <Input value={userEdit?.nom || ""} onChange={(e) => setUserEdit(userEdit ? { ...userEdit, nom: e.target.value } : null)} />
            <Label>Email</Label>
            <Input value={userEdit?.email || ""} onChange={(e) => setUserEdit(userEdit ? { ...userEdit, email: e.target.value } : null)} />
            <Label>Mot de passe (laisser vide pour ne pas changer)</Label>
            <Input type="password" value={""} placeholder="Ne pas changer" disabled />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateUser}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
