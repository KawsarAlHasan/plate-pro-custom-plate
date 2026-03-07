import { Suspense } from "react";
import DxfEditor from "./DxfEditor";
import { getLanguage } from "../lib/i18n/getLanguage";
import { Spin } from "antd";

export default async function page() {
  const { lang, dict } = await getLanguage();
  const shapesText = dict.shapes;

  return (
    <div>
      <Suspense fallback={<Spin size="large" />}>
        <DxfEditor lang={lang} shapesText={shapesText} />
      </Suspense>
    </div>
  );
}
