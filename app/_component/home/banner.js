"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthModal } from "../../contex/AuthModalContext";

export default function Banner({ bannerText }) {
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const handleStart = () => {
    if (Cookies.get("token") !== undefined) {
      router.push("/shapes?shapeId=");
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <section className='w-full bg-[url("/bannerHome.png")] bg-cover bg-center py-14 lg:py-2'>
        <div className="w-full aspect-[1920/752] px-14 text-white flex items-center">
          <div>
            <h1 className="text-5xl">{bannerText?.title}</h1>
            <p className="max-w-[640px] pt-8 pb-[51px]">
              {bannerText?.description}
            </p>

            <Button
              onClick={handleStart}
              className="w-fit! px-20! text-xl! py-7! border-0! bg-black! text-white!"
            >
              {bannerText?.buttonText}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
