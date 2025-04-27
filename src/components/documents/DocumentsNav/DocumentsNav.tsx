import { Nav, NavItem } from "@/components/common";
import type { PDFDefinition } from "@/constants";
import { getPdfDefinition } from "@/forms";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentsNavProps {
  className?: string;
}

export const DocumentsNav = ({ className }: DocumentsNavProps) => {
  const [pdfDefinitions, setPdfDefinitions] = useState<PDFDefinition[]>([]);
  const pdfIds = useQuery(api.userDocuments.list);

  useEffect(() => {
    const fetchPdfDefinitions = async () => {
      if (!pdfIds) return;

      const pdfDefinitions = await Promise.all(
        pdfIds.map((pdfId) => getPdfDefinition(pdfId.pdfId)),
      );
      setPdfDefinitions(pdfDefinitions);
    };
    fetchPdfDefinitions();
  }, [pdfIds]);

  return (
    <Nav className={className}>
      {pdfDefinitions?.map((pdf) => (
        <NavItem
          key={pdf.id}
          icon={FileText}
          href={{
            to: "/documents/$pdfId",
            params: { pdfId: pdf.id },
          }}
        >
          <span className="truncate">{pdf.title}</span>
        </NavItem>
      ))}
    </Nav>
  );
};
