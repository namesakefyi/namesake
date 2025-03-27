import petitionToChangeNameOfAdult from "@/forms/ma/cjp27-petition-to-change-name-of-adult";
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
      pdf: petitionToChangeNameOfAdult,
      userData: {
        newFirstName: "Eva",
        newMiddleName: "K",
        newLastName: "Decker",
        oldFirstName: "Eva",
        oldMiddleName: "K",
        oldLastName: "Decker",
        residenceStreetAddress: "123 Main St",
        residenceCity: "Anytown",
        residenceState: "CA",
        residenceZipCode: "12345",
        email: "eva@example.com",
        phoneNumber: "123-456-7890",
        isMailingAddressDifferentFromResidence: false,
        mailingStreetAddress: "123 Main St",
        mailingCity: "Anytown",
        mailingState: "CA",
        mailingZipCode: "12345",
        dateOfBirth: "1990-01-01",
        hasPreviousNameChange: true,
        previousNameFrom: "My Old Name",
        previousNameTo: "My Other Old Name",
        previousNameReason: "I wanted to change my name",
        shouldReturnOriginalDocuments: true,
        hasUsedOtherNameOrAlias: true,
        otherNamesOrAliases: "Nickname 1, Nickname 2",
        reasonForChangingName: "I want to change my name",
        isInterpreterNeeded: true,
        language: "English",
        isOkayToSharePronouns: true,
        pronouns: "She/Her",
        otherPronouns: "They/Them",
        birthplaceCity: "Anytown",
        birthplaceState: "CA",
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
