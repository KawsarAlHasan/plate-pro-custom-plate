import { getLanguage } from "../lib/i18n/getLanguage";

export default async function page() {
  const { dict } = await getLanguage();

  const aboutUs = dict.about;

  return (
    <>
      {/* ====about page==== */}
      <div>
        <section className='w-full h-fit py-32 bg-[url("/about_us_banner.png")] bg-center'>
          <div>
            <h1 className="text-5xl font-bold text-center text-white">
              {aboutUs?.title}
            </h1>
          </div>
        </section>
      </div>
      {/* ---about us content-- */}
      <div className="w-full">
        <div className="w-full max-w-[1720px] mx-auto py-16 px-5 flex flex-col gap-5">
          <p className="">{aboutUs?.pText1}</p>
          <p>{aboutUs?.pText2}</p>
          <h4 className="font-bold text-xl">{aboutUs?.h4Questions}</h4>
          <ul className="[&>li]:font-light flex flex-col gap-2">
            <li>
              <strong>{aboutUs?.quality} : </strong> {aboutUs?.qualityText}
            </li>
            <li>
              <strong>{aboutUs?.wide_Range} : </strong>{" "}
              {aboutUs?.wide_RangeText}
            </li>
            <li>
              <strong>{aboutUs?.customerService} : </strong>{" "}
              {aboutUs?.customerServiceText}
            </li>
            <li>
              <strong>{aboutUs?.fast_Delivery} : </strong>{" "}
              {aboutUs?.fast_DeliveryText}
            </li>
          </ul>
          <p>{aboutUs?.footer}</p>
        </div>
      </div>
    </>
  );
}
