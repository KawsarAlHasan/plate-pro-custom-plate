import Link from "next/link";
import React from "react";
import { AiFillTikTok } from "react-icons/ai";
import { BsEnvelope } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";

export default function Footer({ dict }) {
  const footerText = dict.footer;

  return (
    <section id="footer" className="w-full bg-black">
      <div className="w-full max-w-[1920px] mx-auto py-12 px-5 xl:py-24 xl:px-20">
        <div className="w-full flex flex-col gap-10 lg:flex-row">
          <div className="footerLogo w-full lg:w-2/6 xl:w-1/6">
            <img src={"/footerLogo.png"} alt="footer logo" />
          </div>
          <div className="footerMenu w-full text-white flex flex-wrap gap-8 justify-between">
            {/* --menu-- */}
            <div>
              <h5 className="text-2xl">{footerText.menu}</h5>
              <ul className="footerMenuList mt-5">
                <li>
                  <Link href={"/"}>{footerText.home}</Link>
                </li>
                <li>
                  <Link href={"/about-us"}>{footerText.about}</Link>
                </li>
                <li>
                  <Link href={"/how-it-works"}>{footerText.howItWorks}</Link>
                </li>
                <li>
                  <Link href={"/contact"}>{footerText.contact}</Link>
                </li>
              </ul>
            </div>
            {/* --Terms & Conditions-- */}
            <div>
              <h5 className="text-2xl">{footerText.termsAndConditions}</h5>
              <ul className="footerMenuList mt-5">
                <li>{footerText.privacyPolicies}</li>
                <li>{footerText.termsAndConditionsLink}</li>
                <li>{footerText.deliveryPolicy}</li>
                <li>{footerText.orderCancellationPolicy}</li>
              </ul>
            </div>

            {/* --Company Data-- */}
            <div>
              <h5 className="text-2xl">{footerText.companyData}</h5>
              <ul className="footerMenuList mt-5">
                <li>{footerText.companyName}</li>
                <li>
                  <a href="tell:0527304050">{footerText.phone}</a>
                </li>
                <li>
                  <a href="mailto:customerservicekachelpand@gmail.com">
                    {footerText.email}
                  </a>
                </li>
                <li>{footerText.address}</li>
              </ul>
            </div>

            {/* ---Contact--- */}
            <div>
              <h5 className="text-2xl">{footerText.contactTitle}</h5>
              <ul className="footerMenuList mt-5">
                <li className="flex items-baseline gap-2">
                  <span>
                    <IoCallOutline />
                  </span>
                  <span>{footerText.phone}</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span>
                    <BsEnvelope />
                  </span>
                  <span>{footerText.email}</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span>
                    <CiClock2 />
                  </span>
                  <span>{footerText.openingHours}</span>
                </li>
              </ul>
              <div className="mt-6">
                <h5 className="text-2xl">{footerText.followUs}</h5>
                <div className="flex gap-5 ">
                  <span>
                    <FaFacebookSquare />
                  </span>
                  <span>
                    <FaInstagramSquare />
                  </span>
                  <span>
                    <AiFillTikTok />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
