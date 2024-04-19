import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "lucide-react";

type Props = {
  signIn: React.ReactNode;
  signOut: React.ReactNode;
};

export const ClerkButtonState = ({ signIn, signOut }: Props) => {
  return (
    <>
      <ClerkLoading>
        <Loader className="w-5 h-5 text-muted-foreground animate-spin" />
      </ClerkLoading>

      <ClerkLoaded>
        {signIn}
        {signOut}
      </ClerkLoaded>
    </>
  );
};
