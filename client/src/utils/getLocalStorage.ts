import { Type } from "@badrap/valita";

export function getLocalStorage<T>(key: string, Schema: Type<T>) {
  try {
    const item = localStorage.getItem(key);
    if (item) return Schema.parse(JSON.parse(item));
  } catch (error) {
    console.error(error);
    localStorage.removeItem(key);
  }
}
