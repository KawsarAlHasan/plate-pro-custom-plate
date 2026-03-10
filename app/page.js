import Banner from "./_component/home/banner";
import FeaturedShapeAndSize from "./_component/home/FeaturedShapeAndSize";
import HowItsWork from "./_component/home/howItsWork";
import GetStarted from "./_component/home/getStarted";
import { AuthModalProvider } from "./contex/AuthModalContext";
import AuthModal from "./_component/auth/AuthModal";
import { getLanguage } from "./lib/i18n/getLanguage";
import Guide from "./Test";

export default async function Home() {
  const { dict } = await getLanguage();
  const homeText = dict.home;

  return (
    <>
      <AuthModalProvider>
        <section>
          <div className="w-full">
            <Guide />
            <Banner bannerText={homeText?.banner} />
            <FeaturedShapeAndSize shapeAndSizeText={homeText?.featuredShapes} />
            <HowItsWork howItWorksText={homeText?.howItWorks} />
            <GetStarted getStartedText={homeText?.getStarted} />
            <AuthModal dict={dict} />
          </div>
        </section>
      </AuthModalProvider>
    </>
  );
}
