export const SERVICES: { title: string; value: Service }[] = [
  { title: "Notary", value: "notary" },
  { title: "Name change clinics", value: "nameChangeClinic" },
  { title: "Form filling assistance", value: "formFillingAssistance" },
  { title: "Financial assistance", value: "financialAssistance" },
  { title: "Legal representation", value: "legalRepresentation" },
];

export type Service =
  | "notary"
  | "nameChangeClinic"
  | "formFillingAssistance"
  | "financialAssistance"
  | "legalRepresentation";

export const SERVICE_LABELS: Record<Service, string> = Object.fromEntries(
  SERVICES.map(({ value, title }) => [value, title]),
) as Record<Service, string>;
