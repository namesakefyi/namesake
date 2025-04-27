import { Nav, NavItem } from "@/components/common";
import type { PDFId } from "@/constants";
import { usePDFDetails } from "@/hooks/usePDFDetails";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { FileText } from "lucide-react";

interface DocumentsNavProps {
  className?: string;
}

export const DocumentsNav = ({ className }: DocumentsNavProps) => {
  const userDocuments = useQuery(api.userDocuments.list);
  const pdfIds = userDocuments?.map((userDocument) => userDocument.pdfId);
  const pdfs = usePDFDetails(pdfIds as PDFId[]);

  return (
    <Nav className={className}>
      {pdfs?.map((pdf) => (
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
