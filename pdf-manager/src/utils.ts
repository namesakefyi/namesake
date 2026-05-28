export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8.length; i += 8192) {
    binary += String.fromCharCode(...uint8.subarray(i, i + 8192));
  }
  return btoa(binary);
}
