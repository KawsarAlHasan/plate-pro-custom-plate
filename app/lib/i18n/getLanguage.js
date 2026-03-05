import { cookies } from "next/headers";
import { getDictionary } from "./getDictionary";

export const getLanguage = async () => {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  const dict = await getDictionary(lang);

  return { lang, dict };
};
