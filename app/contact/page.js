import { CiClock2 } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { getLanguage } from "../lib/i18n/getLanguage";

export default async function page() {
  const { dict } = await getLanguage();

  const contact = dict.contact;

  return (
    <div>
      {/* ====about page==== */}
      <div>
        <section className='w-full h-fit py-40 bg-[url("/contact_banner.png")] bg-cover bg-bottom bg-no-repeat'>
          <div>
            <h1 className="text-5xl font-bold text-center text-white">
              CONTACT
            </h1>
          </div>
        </section>
      </div>
      {/* ---about us content-- */}
      <div className="w-full">
        <div className="w-full max-w-[1720px] mx-auto py-16 px-5 flex flex-col gap-5">
          <h2 className="text-3xl font-bold">Contact</h2>
          <h6 className="font-semibold">{contact?.h6Text}</h6>

          <ul className="[&>li]:font-light flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <span>
                <IoCallOutline />
              </span>
              <span>0527304050</span>
            </li>
            <li className="flex items-center gap-2">
              <span>
                <TfiEmail />
              </span>
              <span>customerservicekachelpand@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <span>
                <CiClock2 />
              </span>
              <span>{contact?.time}</span>
            </li>
          </ul>
          <p>{contact?.footer}</p>
        </div>
      </div>
    </div>
  );
}
