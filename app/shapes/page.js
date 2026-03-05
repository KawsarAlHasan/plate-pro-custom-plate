import DxfEditor from "./DxfEditor";
import { getLanguage } from "../lib/i18n/getLanguage";

export default async function page() {
  const { lang, dict } = await getLanguage();
  const shapesText = dict.shapes;

  return (
    <div>
      <DxfEditor lang={lang} shapesText={shapesText} />
    </div>
  );
}
