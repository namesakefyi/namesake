export const SERVICES: { title: string; value: Service }[] = [
  { title: "Financial aid", value: "financialAid" },
  { title: "Form filling help", value: "formFilling" },
  { title: "Legal support", value: "legal" },
  { title: "Name change clinics", value: "nameChangeClinic" },
  { title: "Notary", value: "notary" },
];

export type Service =
  | "financialAid"
  | "formFilling"
  | "legal"
  | "nameChangeClinic"
  | "notary";

export const SERVICE_LABELS: Record<Service, string> = Object.fromEntries(
  SERVICES.map(({ value, title }) => [value, title]),
) as Record<Service, string>;
