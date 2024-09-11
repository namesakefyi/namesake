import { v } from "convex/values";
import { action } from "./_generated/server";

/** https://openlaws.apidocumentation.com/api-reference#/tag/divisions/GET/api/v1/jurisdictions/{jurisdiction_id}/divisions/keyword_search */

export type LawData = {
  /** OpenLaws identifier for the Law. */
  law_key: string;

  /** Human-readable identifier for the Division; guaranteed to be unique among its sibling Divisions */
  label: string;

  /** The concatenation of all of the Division's ancestors's labels resulting in a filepath-like string */
  path: string;

  /** OpenLaws standardization of the Division document type */
  division_type: string;

  /** The source document's identifier */
  identifier: string;

  /** If the Division is part a range, this contains the ending value for the identifier range, e.g., §§ 100 to 200 -> 200 is the range_end_identifier. */
  range_end_identifier?: string;

  /** The name of the document from the source document. */
  name?: string;

  /** If the source documment and annotations contain an effective date, this field will be contain the start and end date as a range. Positive and negative infinity indicate the effective date is unbounded. */
  effective_date: string;

  /** OpenLaws' internal notes for the Division. */
  description?: string;

  /** Contains short or common names for the Division */
  aliases?: string;

  /** Plaintext content without rich text formatting and markup to define pincite locations. Suitable for use with LLMs. */
  plaintext_content: string;

  /** Rich text content in Commonmark with CSS annotations. Meant to be rendered into human-readable HTML along with the OpenLaws Markdown CSS. */
  markdown_content: string;

  /** Annotations and interpretations if available from the official source. */
  annotations?: string;

  /** Authoritative Source URL for law. Deep-links to the source where supported. **(Law Firm and Enterprise plans only.)** */
  source_url: string;

  /** (Experimental) Whether the Division is repealed, contingent repealed, or no longer effective. */
  is_repealed?: boolean;

  /** (Experimental) Whether the Division identifier and range_end_identifier are reserved by the Jurisdiction */
  is_reserved?: boolean;

  /** (Experimental) Contains the new identifier and location where the Division was renumbered to. */
  renumbered?: string;
};

export const getLaws = action({
  args: {
    // Two letter Jurisdiction ID, or 'FED' for federal
    jurisdiction: v.string(),
    // Keyword to search for
    query: v.string(),
  },
  handler: async (_ctx, args) => {
    const encodedQuery = encodeURIComponent(args.query);
    const url = `https://beta.openlaws.us/api/v1/jurisdictions/${args.jurisdiction}/divisions/keyword_search?query=${encodedQuery}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.OPENLAWS_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data: Promise<LawData[]> = await response.json();
    return data;
  },
});
