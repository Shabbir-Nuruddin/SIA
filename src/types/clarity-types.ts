// Manual type extensions for the clarity_* tables that are not yet in the
// auto-generated Supabase types file. Provides an untyped supabase client for
// those queries so TypeScript stops rejecting the table names.
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clarityDb = supabase as any;
