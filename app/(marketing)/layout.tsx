import { Header } from "./header";
import { Footer } from "./footer";
import { db } from "@/lib/db";
import { isNewUpdate } from "@/lib/utils";
type Props = {
  children: React.ReactNode;
};

const MarketingLayout = async ({ children }: Props) => {
  const lastUpdate = await db.changelog.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col w-full bg-zinc-950">
      <Header isNewUpdate={isNewUpdate(lastUpdate?.createdAt)} />
      <main className="lg:w-[950px] px-4 lg:px-0 mx-auto flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
