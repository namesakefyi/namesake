import coriAndWmsReleaseRequest from "@/forms/ma/cjp34-cori-and-wms-release-request";
import { fillPdf } from "@/utils/pdf";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_authenticated/documents/")({
  component: RouteComponent,
});

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  // For example only
  const displayPdf = async () => {
    const pdfBytes = await fillPdf({
      pdf: coriAndWmsReleaseRequest,
      userData: {
        residenceCounty: "Suffolk", // TODO: https://github.com/namesakefyi/namesake/issues/453
        oldFirstName: "Eva",
        oldMiddleName: "K",
        oldLastName: "Decker",
        dateOfBirth: "1990-01-01",
        mothersMaidenName: "Smith",
        otherNamesOrAliases: "Nickname 1, Nickname 2",
      },
    });

    const url = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" }),
    );

    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.width = "100%";
      iframe.style.height = "800px";
      iframe.style.border = "none";

      containerRef.current.appendChild(iframe);
    }
  };

  useEffect(() => {
    displayPdf();
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
