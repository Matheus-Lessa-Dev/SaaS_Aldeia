export type ManagementSortOption = "nameAsc" | "newest" | "oldest";

export function sortManagementItems<T extends { id: number; name: string }>(
  items: T[],
  sortOption: ManagementSortOption,
) {
  return [...items].sort((a, b) => {
    if (sortOption === "newest") {
      return b.id - a.id;
    }

    if (sortOption === "oldest") {
      return a.id - b.id;
    }

    return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
  });
}
