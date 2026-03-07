import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useEducationProgress = (segment: "homemakers" | "kids", topicIds: string[]) => {
  const { user } = useAuth();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [certificate, setCertificate] = useState<{ certificate_number: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const [progressRes, certRes] = await Promise.all([
      supabase.from("education_progress").select("topic_id").eq("user_id", user.id).eq("segment", segment),
      supabase.from("certificates").select("certificate_number").eq("user_id", user.id).eq("segment", segment).maybeSingle(),
    ]);

    if (progressRes.data) {
      setCompletedTopics(progressRes.data.map((r) => r.topic_id));
    }
    if (certRes.data) {
      setCertificate(certRes.data);
    }
    setLoading(false);
  }, [user, segment]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markComplete = async (topicId: string) => {
    if (!user) {
      toast.error("Please sign in to track your progress");
      return;
    }
    if (completedTopics.includes(topicId)) return;

    const { error } = await supabase.from("education_progress").insert({
      user_id: user.id,
      segment,
      topic_id: topicId,
    });

    if (error) {
      if (error.code === "23505") {
        // already exists
        setCompletedTopics((prev) => [...prev, topicId]);
      } else {
        toast.error("Failed to save progress");
      }
      return;
    }

    const newCompleted = [...completedTopics, topicId];
    setCompletedTopics(newCompleted);

    // Check if all topics are done
    if (newCompleted.length === topicIds.length && !certificate) {
      await issueCertificate();
    }
  };

  const issueCertificate = async () => {
    if (!user) return;
    const certNumber = `BN-${segment.toUpperCase().slice(0, 2)}-${Date.now().toString(36).toUpperCase()}`;
    
    const { data, error } = await supabase.from("certificates").insert({
      user_id: user.id,
      segment,
      certificate_number: certNumber,
    }).select("certificate_number").single();

    if (!error && data) {
      setCertificate(data);
      // Try to send email notification
      try {
        await supabase.functions.invoke("send-certificate-email", {
          body: { user_email: user.email, user_name: user.user_metadata?.full_name, segment, certificate_number: certNumber },
        });
      } catch {
        // Non-blocking
      }
    }
  };

  const allCompleted = completedTopics.length === topicIds.length;

  return { completedTopics, certificate, loading, markComplete, allCompleted };
};
