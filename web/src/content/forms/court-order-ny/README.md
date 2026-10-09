# New York adult court-order draft

Preview at `/forms/court-order-ny`. This unlisted draft uses the standard PDF download flow. Downloads include UCS-NC1 with all collected answers mapped. Inapplicable sections and hidden follow-up answers are omitted. Filing instructions are not implemented.

- Edit the order in `index.ts` and the questions in `steps/`.
- `conditions.ts` selects name-change, sex-designation-change, or combined paths.
- Uses the existing MA/RI form components and the repository's UCS-NC1 (06/2025) petition. Source: https://www.nycourts.gov/media/32631.
- The PDF monitor received HTTP 403 for NY on October 4, 2026, so upstream freshness is not verified.
- Previous petition history is separate from completed name changes stored by other states.
- Court is free text with a link to the NY court locator; residential and court counties use the NY county list. Fees, address edge cases, and filing guidance need review.
- Signature dates and the court-assigned index number remain blank for completion when signing or filing. Age is derived from date of birth at download time. Residence addresses use the existing US address component.
- The bundled PDF's yes/no fields were normalized to distinct `Yes`/`No` values, with inherited selections cleared. The two separate previous-name-petition buttons are checkboxes. A stale value on a repeated request-type widget was removed so it inherits the parent field value. Printed page content is unchanged; regenerate `schema.ts` after any template changes.
- Resolver tests reopen generated PDFs and check field values, radio widget selection, unanswered questions, and stale hidden answers for all three request types.
- Before publishing: review wording and branches, resolve the county-dropdown browser-check failure, and supply reviewed filing instructions. Guide writing remains a separate contribution.
