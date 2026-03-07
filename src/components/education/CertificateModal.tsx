import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Gift, Award } from "lucide-react";
import { jsPDF } from "jspdf";

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  segment: "homemakers" | "kids";
  certificateNumber: string;
  onClaimGift: () => void;
}

const CertificateModal = ({ open, onOpenChange, userName, segment, certificateNumber, onClaimGift }: CertificateModalProps) => {
  const segmentLabel = segment === "homemakers" ? "Financial Education for Homemakers" : "Financial Education for Young Minds";

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Border
    doc.setDrawColor(227, 137, 42);
    doc.setLineWidth(3);
    doc.rect(10, 10, w - 20, h - 20);
    doc.setLineWidth(1);
    doc.rect(14, 14, w - 28, h - 28);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(227, 137, 42);
    doc.text("BALAJI NIVESH", w / 2, 35, { align: "center" });

    // Title
    doc.setFontSize(32);
    doc.setTextColor(30, 41, 59);
    doc.text("Certificate of Completion", w / 2, 55, { align: "center" });

    // Decorative line
    doc.setDrawColor(227, 137, 42);
    doc.setLineWidth(0.8);
    doc.line(w / 2 - 60, 60, w / 2 + 60, 60);

    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text("This is to certify that", w / 2, 78, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(30, 41, 59);
    doc.text(userName || "Learner", w / 2, 93, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text("has successfully completed all topics in", w / 2, 108, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(227, 137, 42);
    doc.text(segmentLabel, w / 2, 120, { align: "center" });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Certificate No: ${certificateNumber}`, w / 2, 150, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, w / 2, 157, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Issued by Balaji Nivesh — Empowering Financial Literacy", w / 2, 170, { align: "center" });

    doc.save(`Balaji-Nivesh-Certificate-${certificateNumber}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange-light">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">🎉 Congratulations!</DialogTitle>
          <DialogDescription className="text-center">
            You've completed all topics in <strong>{segmentLabel}</strong>. Download your certificate and claim your gift!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button onClick={generatePDF} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" /> Download Certificate (PDF)
          </Button>
          <Button onClick={onClaimGift} variant="outline" className="w-full border-brand-green text-brand-green hover:bg-brand-green-light" size="lg">
            <Gift className="mr-2 h-4 w-4" /> Claim Your Physical Gift
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
