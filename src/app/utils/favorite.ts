import { Laptop } from "../lib/constants/models";

export const getFavorite = (): number[] => {
  if (typeof window === "undefined") return [];
  const favorite = localStorage.getItem("favorite");
  return favorite ? JSON.parse(favorite) : [];
};

export const getFavoriteLaptops = (allLaptops: Laptop[]): Laptop[] => {
  const favoriteIds = getFavorite();
  return allLaptops.filter((laptop) => favoriteIds.includes(laptop.id)) || [];
};

export const addToFavorite = (ids: number[]) => {
  if (typeof window === "undefined") return;
  const favorite = getFavorite();
  ids.forEach((id) => {
    if (!favorite.includes(id)) {
      favorite.push(id);
    }
  });
  localStorage.setItem("favorite", JSON.stringify(favorite));
};

export const removeFromFavorite = (id: number) => {
  if (typeof window === "undefined") return;
  const favorite = getFavorite();
  const updated = favorite.filter((fav) => fav !== id);
  localStorage.setItem("favorite", JSON.stringify(updated));
};

export const isFavorite = (id: number): boolean => {
  return getFavorite().includes(id);
};

export const clearFavorites = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("favorite");
};
