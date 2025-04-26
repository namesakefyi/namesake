function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitFor(fn: () => boolean) {
  while (!fn()) {
    await delay(10);
  }
}
