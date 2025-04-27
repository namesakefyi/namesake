import { Nav, NavItem } from "@/components/common";
import type { PDFId } from "@/constants";
import { usePDFDetails } from "@/hooks/usePDFDetails";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { FileText } from "lucide-react";

const DocumentsNavItem = ({ pdfId }: { pdfId: PDFId }) => {
  const { data } = usePDFDetails(pdfId);
  return (
    <NavItem
      icon={FileText}
      href={{ to: "/documents/$pdfId", params: { pdfId } }}
    >
      <span className="truncate">{data?.title}</span>
    </NavItem>
  );
};

interface DocumentsNavProps {
  className?: string;
}

export const DocumentsNav = ({ className }: DocumentsNavProps) => {
  const userDocuments = useQuery(api.userDocuments.list);
  const pdfIds = userDocuments?.map((userDocument) => userDocument.pdfId);
  const hasDocuments = pdfIds && pdfIds.length > 0;

  if (!hasDocuments) return null;

  return (
    <Nav className={className}>
      {pdfIds?.map((pdfId) => (
        <DocumentsNavItem key={pdfId} pdfId={pdfId} />
      ))}
    </Nav>
  );
};
