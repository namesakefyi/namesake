import type { SanityAssetDocument } from "@sanity/client";
import type { Service } from "@/constants/services";

export interface DirectoryContact {
  name: string;
  slug: string;
  description: string;
  states: string[];
  services: Service[];
  email?: string;
  phone?: string;
  url: string;
  logo?: { asset: SanityAssetDocument };
  officialPartner?: boolean;
}
