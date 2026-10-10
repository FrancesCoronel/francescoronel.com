// Stands in for public/pagefind/pagefind.js, which only exists after a build
// and which Vite refuses to import from public/. Tests mock it per case.
export async function init() {}
export async function search() {
  return { results: [] };
}
