"use client";
import { FeatureCard } from "./feature-card";
import { Section } from "./section";
import { PriceCard } from "./price-card";

const MarketingPage = () => {
  return (
    <div className="py-20">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center justify-center gap-y-6 text-center">
          <h1 className="text-gradient text-5xl font-bold tracking-tight md:text-7xl">
            Your Ultimate Reading Companion
          </h1>
          <p className="mt-6 text-lg text-balance font-medium text-muted-foreground md:text-xl">
            Discover, manage, and engage with your favorite books effortlessly.
            Book Mate offers a comprehensive platform where you can explore,
            track, and interact with your reading journey—all in one place.
          </p>
        </div>
      </div>

      <Section title="Features" id="features">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FeatureCard
            imgSrc="/search-books.png"
            title="Manage Your Reading List"
            description="Explore a vast collection of books from various genres and authors."
          />
          <FeatureCard
            imgSrc="/track-books.png"
            title="Track Your Progress"
            description="Keep track of your reading progress and set goals to stay motivated."
          />
          <FeatureCard
            imgSrc="/book-chat.png"
            title="Know More About the Book"
            description="Use chatGPT to get a summary of the book or ask questions about it."
          />
          <FeatureCard
            imgSrc="/share-your-thoughts.png"
            title="Engage with the Community"
            description="Connect with other readers, share your thoughts, and discover new books."
          />
          <FeatureCard
            imgSrc="/share-your-books-list.png"
            title="Share Your Favorite Books"
            description="Share your favorite books with friends and get recommendations from them."
          />
        </div>
      </Section>

      <Section title="Pricing" id="pricing">
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PriceCard
              plan="Basic"
              price="Free"
              features={[
                "Save Up to 5 Books",
                "Ask Up to 5 Questions Per Book",
              ]}
            />
            <PriceCard
              plan="Pro"
              price="15"
              pricePerUnit="﷼/month"
              features={["Unlimited Book Saving", "Unlimited Questions"]}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default MarketingPage;

{
  /* <button className="group relative rounded-full p-px text-sm/6 text-zinc-400 duration-300 hover:text-zinc-100 hover:shadow-glow">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative z-10 rounded-full bg-zinc-950 px-4 py-1.5 ring-1 ring-white/10">
          CLICK HERE
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button> */
}
