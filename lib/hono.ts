import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_ABSOLUTE_URL!); // process.env.PUBLIC_ABSOLUTE_URL!
