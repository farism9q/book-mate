import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <p className="text-emerald-500">Hello there</p>
      <Button variant={"premium"}>Click me</Button>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </>
  );
}
