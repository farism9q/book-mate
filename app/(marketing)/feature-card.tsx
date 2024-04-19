import Image from "next/image";

type Props = {
  imgSrc: string;
  title: string;
  description: string;
};

export const FeatureCard = ({ imgSrc, title, description }: Props) => {
  return (
    <div className="relative overflow-hidden h-[400px] rounded-md rounded-r-3xl rounded-l-2xl shadow-2xl">
      <div className="w-fullh-full relative">
        <Image
          src={imgSrc}
          alt={title}
          width={500}
          height={550}
          quality={100}
        />
      </div>
      <div className="py-2 flex justify-center items-center w-full h-full relative">
        <div className="px-8 pt-2 flex flex-col gap-y-4 snap-center md:snap-none h-full md:snap-align-none backdrop-blur-sm border-white/20 z-20">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div
          className={
            "absolute inset-6 bottom-0 bg-gradient-to-r from-orange-400 to-orange-400 opacity-10 rounded-3xl blur-3xl"
          }
        />
      </div>
    </div>
  );
};
