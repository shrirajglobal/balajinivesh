import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onStatusChange?: (connected: boolean) => void;
}

export interface CalendarStatus {
  connected: boolean;
  google_email: string | null;
}

export const useGoogleCalendarConnection = () => {
  const [status, setStatus] = useState<CalendarStatus>({ connected: false, google_email: null });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("partner-calendar", {
      body: { action: "status" },
    });
    if (!error && data) setStatus(data as CalendarStatus);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { status, loading, refresh, setStatus };
};

const GoogleCalendarConnect = ({ onStatusChange }: Props) => {
  const { toast } = useToast();
  const { status, loading, refresh, setStatus } = useGoogleCalendarConnection();
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    onStatusChange?.(status.connected);
  }, [status.connected, onStatusChange]);

  useEffect(() => () => { if (pollRef.current) window.clearInterval(pollRef.current); }, []);

  const connect = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("partner-calendar", {
      body: { action: "connect", return_url: window.location.href },
    });
    setBusy(false);
    const url = (data as { authorization_url?: string } | null)?.authorization_url;
    if (error || !url) {
      toast({
        title: "Could not start Google Calendar connection",
        description: "The calendar integration isn't available yet. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    const popup = window.open(url, "google-calendar-connect", "width=520,height=680");
    // Poll until the consent window closes, then confirm the connection server-side.
    pollRef.current = window.setInterval(async () => {
      if (popup && !popup.closed) return;
      if (pollRef.current) window.clearInterval(pollRef.current);
      const { data: profile } = await supabase.functions.invoke("partner-calendar", {
        body: { action: "refresh_profile" },
      });
      const p = profile as CalendarStatus | null;
      if (p?.connected) {
        setStatus(p);
        toast({ title: `Connected as ${p.google_email ?? "your Google account"}` });
      } else {
        await refresh();
      }
    }, 1000);
  };

  const disconnect = async () => {
    setBusy(true);
    await supabase.functions.invoke("partner-calendar", { body: { action: "disconnect" } });
    setBusy(false);
    setStatus({ connected: false, google_email: null });
    toast({ title: "Google Calendar disconnected" });
  };

  if (loading) return null;

  if (status.connected) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
        <CalendarCheck className="h-4 w-4 text-success" />
        <span className="text-muted-foreground">
          Connected as <span className="font-medium text-foreground">{status.google_email ?? "Google Calendar"}</span>
        </span>
        <Button variant="ghost" size="sm" onClick={disconnect} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Disconnect"}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={connect} disabled={busy}>
      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
      Connect Google Calendar
    </Button>
  );
};

export default GoogleCalendarConnect;
