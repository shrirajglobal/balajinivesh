import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

const AdminLocator = () => {
  const qc = useQueryClient();
  const [partnerId, setPartnerId] = useState<string>("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setStateName] = useState("");

  const { data: partners } = useQuery({
    queryKey: ["partners-active"],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, user_id, status, profiles:user_id(full_name)")
        .eq("status", "active");
      return data ?? [];
    },
  });

  const { data: areas } = useQuery({
    queryKey: ["service-areas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_service_areas")
        .select("*, partners:partner_id(user_id, profiles:user_id(full_name))")
        .order("pincode");
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!partnerId || !/^[0-9]{6}$/.test(pincode)) throw new Error("Pick a partner and enter a valid 6-digit PIN");
      const { error } = await supabase.from("partner_service_areas").insert({
        partner_id: partnerId,
        pincode,
        city: city || null,
        state: state || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Service area added");
      setPincode(""); setCity(""); setStateName("");
      qc.invalidateQueries({ queryKey: ["service-areas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_service_areas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["service-areas"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">MFD Locator — Service Areas</h1>
        <p className="text-sm text-muted-foreground">Map active partners to PIN codes they serve.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Assign PIN to partner</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Partner</label>
              <Select value={partnerId} onValueChange={setPartnerId}>
                <SelectTrigger><SelectValue placeholder="Choose a partner" /></SelectTrigger>
                <SelectContent>
                  {partners?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.profiles?.full_name || p.user_id.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">PIN code</label>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="700001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kolkata" />
            </div>
          </div>
          <Input value={state} onChange={(e) => setStateName(e.target.value)} placeholder="State (optional)" />
          <Button onClick={() => add.mutate()} disabled={add.isPending}>
            <Plus className="mr-1 h-4 w-4" /> Add service area
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-foreground">Mapped service areas ({areas?.length ?? 0})</h2>
        {areas?.map((a: any) => (
          <Card key={a.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {a.partners?.profiles?.full_name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PIN {a.pincode} · {a.city ?? "—"}{a.state ? `, ${a.state}` : ""}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(a.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminLocator;
