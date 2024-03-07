import { redirectToSignIn } from "@clerk/nextjs";

import { initialUser } from "@/lib/initial-user";

const InitialPage = async () => {
  const user = await initialUser();

  if (!user) {
    return redirectToSignIn();
  }

  return <div>Welcome</div>;
};

export default InitialPage;
