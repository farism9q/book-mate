"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EmptyProps {
  label: string;
  description?: string;
  img?: { src: string; alt: string };
  clickable?: boolean;
  onClickHrf?: string;
}

export default function Empty({
  label,
  description,
  img,
  clickable,
  onClickHrf,
}: EmptyProps) {
  const router = useRouter();
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center gap-y-2">
      {img?.src && (
        <div
          onClick={() => {
            if (!onClickHrf) return;
            router.push(onClickHrf);
          }}
          className={cn(
            clickable &&
              "cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
          )}
        >
          <Image src={img.src} alt={img.alt} width={260} height={260} />
        </div>
      )}
      <p className="text-muted-foreground text-lg md:text-2xl text-center">
        {label}
      </p>
      {description && (
        <p className="text-muted-foreground/80 text-sm md:text-base text-center">
          {description}
        </p>
      )}
    </div>
  );
}
