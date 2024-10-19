import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabase_url, supabase_anon_key);

export { supabase };
