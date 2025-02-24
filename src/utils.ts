export async function sleep(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}
