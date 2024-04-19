import { Header } from "./header";
import { Footer } from "./footer";
type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col w-full bg-zinc-950">
      <Header />
      <main className="lg:w-[950px] px-4 lg:px-0 mx-auto flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
