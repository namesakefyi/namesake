import { SERVICES, type Service } from "@/constants/services";

const allowedServiceValues = new Set(SERVICES.map((s) => s.value));
const stateSlugPattern = /^[a-z]{2}$/;

export function parseDirectorySearchParams(searchParams: URLSearchParams): {
  selectedStateSlug: string;
  selectedService: string;
} {
  const stateParam = searchParams.get("state") ?? "";
  const selectedStateSlug = stateSlugPattern.test(stateParam) ? stateParam : "";

  const serviceParam = searchParams.get("service") ?? "";
  const selectedService = allowedServiceValues.has(serviceParam as Service)
    ? serviceParam
    : "";

  return { selectedStateSlug, selectedService };
}
