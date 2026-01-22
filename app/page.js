import Banner from "./_component/home/banner";
import FeaturedShapeAndSize from "./_component/home/FeaturedShapeAndSize";
import HowItsWork from "./_component/home/howItsWork";
import GetStarted from "./_component/home/getStarted";
import { AuthModalProvider } from "./contact/AuthModalContext";
import AuthModal from "./_component/auth/AuthModal";

export default function Home() {
  return (
    <>
      <AuthModalProvider>
        <section>
          <div className="w-full">
            <Banner />
            <FeaturedShapeAndSize />
            <HowItsWork />
            <GetStarted />
            <AuthModal />
          </div>
        </section>
      </AuthModalProvider>
    </>
  );
}
