/**
 * Fetch a PDF file from the /src/forms.
 */
export async function fetchPdf(path: string): Promise<ArrayBuffer> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF from "${path}": ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/pdf")) {
    throw new Error(
      `Invalid content type for "${path}": Expected PDF but got ${contentType}`,
    );
  }

  return response.arrayBuffer();
}
