import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://oxyhpuwphgbjwmjqjrkh.supabase.co";
const supabaseKey = "sb_publishable_woOkXqhQCXkcAKdyIbZPRQ_IPJ0Fb9n";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
