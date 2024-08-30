import { number, object, string } from "@badrap/valita";

const Schema = object({
  expires: number(),
  url: string()
});

export function getIconUrlFromLS(key: string) {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const result = Schema.try(JSON.parse(item));
      if (result.ok) return result.value;
    }
  } catch (error) {
    console.error(error);
    localStorage.removeItem(key);
  }
}
