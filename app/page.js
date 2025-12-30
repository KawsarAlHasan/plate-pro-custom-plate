import Image from "next/image";
import Banner from "./_component/home/banner";
import FeaturedShapeAndSize from "./_component/home/FeaturedShapeAndSize";
import HowItsWork from "./_component/home/howItsWork";
import GetStarted from "./_component/home/getStarted";

export default function Home() {
  return (
    <>
    <section>
      <div className="w-full">
      <Banner/>
      <FeaturedShapeAndSize />
      <HowItsWork/>
      <GetStarted />
      </div>
    </section>
    </>
  );
}
