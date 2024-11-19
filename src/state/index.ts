import { atom } from "recoil";

export const searchQuery = atom<string>({
  key: "searchQuery",
  default: "",
});

export const isSearch = atom<boolean>({
  key: "isSearch",
  default: false,
});
