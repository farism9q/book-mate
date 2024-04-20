import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  imgSrc: string;
  title: string;
  description: string;
  count: number;
};

export const FeatureCard = ({ imgSrc, title, description, count }: Props) => {
  console.log("count:count:count:");
  console.log(count);
  console.log(count % 2 === 0);
  return (
    <div className="relative overflow-hidden h-[400px] rounded-md rounded-r-3xl rounded-l-2xl shadow-2xl">
      <div
        className={cn(
          "grid grid-cols-2 gap-x-3 group rounded-lg p-px text-sm/6 text-zinc-400 duration-300 hover:text-zinc-100 hover:shadow-glow"
        )}
        style={{
          direction: count % 2 === 0 ? "rtl" : "ltr",
        }}
      >
        <div
          className="w-full h-full relative 
    "
        >
          <span
            className={cn(
              "absolute  h-full w-2 bg-gradient-to-r from-amber-400/0 via-amber-400/90 transition-opacity opacity-40 duration-500 group-hover:opacity-100",
              count % 2 === 0 ? "-left-[7px]" : "-right-[14px]"
            )}
          />

          <Image
            src={imgSrc}
            alt={title}
            width={500}
            height={550}
            quality={100}
          />
        </div>

        <div className="py-2 flex justify-center items-center w-full h-full relative z-10">
          <span
            className={cn(
              "absolute top-0 h-full w-full from-amber-400/40 to-transparent transition-opacity opacity-20 duration-500 group-hover:opacity-100",
              count % 2 === 0
                ? "bg-gradient-to-l -right-[6px]"
                : "bg-gradient-to-r -right-0"
            )}
          />{" "}
          <div
            className={cn(
              "px-6 pt-2 flex flex-col justify-center gap-y-4 snap-center md:snap-none h-full md:snap-align-none backdrop-blur-sm border-white/20 z-20 transition-opacity opacity-40 duration-500  group-hover:opacity-100"
            )}
          >
            <h3 className={"text-lg md:text-2xl font-medium text-left"}>
              {title}
            </h3>
            <p
              className={"text-sm md:text-lg text-[#a0adc2]"}
              style={{
                direction: count % 2 === 0 ? "ltr" : "ltr",
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
