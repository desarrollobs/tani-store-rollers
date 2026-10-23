
import { createClient } from
  'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL =
  'https://avkunaesnxcllgsgkufl.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_HMqjdqe2kinglRvmSxGlNA_f4yaqDGp';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
