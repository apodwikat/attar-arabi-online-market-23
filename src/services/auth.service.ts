
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth.types";
import { Database } from "@/integrations/supabase/types";

// Handle profile fetching for a user
export const fetchUserProfile = async (userId: string): Promise<{ 
  profile: any, 
  adminData: any,
  error: Error | null 
}> => {
  try {
    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select("*")
      .eq("auth_id", userId)
      .single();

    if (adminError && adminError.code !== "PGRST116") { // Not found is ok
      console.warn("Admin check error:", adminError);
    }

    return { profile, adminData, error: null };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { profile: null, adminData: null, error: error as Error };
  }
};

// Map database user to app user model
export const mapUserFromProfile = (
  userId: string,
  profile: any,
  adminData: any
): User => {
  return {
    id: userId,
    name: profile?.full_name || "User",
    city: profile?.region || "",
    phone: profile?.phone_number_1 || "",
    isAuthenticated: true,
    isOwner: adminData?.role === "owner" || false
  };
};

// Login with email/password
export const loginWithEmailPassword = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

// Login with Facebook
export const loginWithFacebookOAuth = async () => {
  return supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};

// Update user profile
export const updateProfile = async (userId: string, profileData: any) => {
  return supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profileData
    }, { onConflict: "id" });
};

// Logout user
export const signOut = async () => {
  return supabase.auth.signOut();
};
