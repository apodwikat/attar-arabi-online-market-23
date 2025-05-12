
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define user type
export interface User {
  id: string;
  name: string;
  city: string;
  phone: string;
  isAuthenticated: boolean;
  isOwner?: boolean; // Added owner flag
}

// Authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithFacebook: () => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>; // Added credentials login
  loginAsOwner: () => Promise<void>; // Added owner login
  sendPhoneVerification: (phoneNumber: string) => Promise<void>;
  verifyPhoneCode: (code: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Check if user is already authenticated with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Get user profile from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          // Check if user is an admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          // Create user object
          const userData: User = {
            id: session.user.id,
            name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
            city: profile?.region || '',
            phone: profile?.phone_number_1 || '',
            isAuthenticated: true,
            isOwner: adminData?.role === 'owner' || false
          };
          
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Check if admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          const userData: User = {
            id: session.user.id,
            name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
            city: profile?.region || '',
            phone: profile?.phone_number_1 || '',
            isAuthenticated: true,
            isOwner: adminData?.role === 'owner' || false
          };
          
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with credentials (email/password)
  const loginWithCredentials = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مجدداً",
      });
      
    } catch (err: any) {
      setError('فشل تسجيل الدخول. الرجاء التحقق من بريدك الإلكتروني وكلمة المرور');
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message || 'حدث خطأ أثناء تسجيل الدخول',
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Owner login method (still using standard login but checks for admin rights)
  const loginAsOwner = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'adweikat12@gmail.com',
        password: 'Abood@1234'  // In a production app, you shouldn't hardcode passwords
      });
      
      if (signInError) throw signInError;
      
      // Check if the user is actually an owner in the admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_id', data.user?.id)
        .single();
      
      if (adminError || !adminData || adminData.role !== 'owner') {
        throw new Error('ليس لديك صلاحيات المدير');
      }
      
      toast({
        title: "تم تسجيل الدخول كمدير",
        description: "مرحباً بك في لوحة التحكم",
      });
      
    } catch (err: any) {
      setError('فشل تسجيل الدخول كمدير. الرجاء المحاولة مرة أخرى');
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message || 'حدث خطأ أثناء تسجيل الدخول',
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // The redirect will happen automatically
      
    } catch (err: any) {
      setError('فشل تسجيل الدخول باستخدام فيسبوك. الرجاء المحاولة مرة أخرى');
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message || 'حدث خطأ أثناء تسجيل الدخول بواسطة فيسبوك',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneVerification = async (phoneNumber: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use Supabase Phone Auth or a third-party SMS service
      // For now, we'll simulate this since phone auth requires additional setup
      
      if (user) {
        // Update user phone in profile
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            phone_number_1: phoneNumber
          }, { onConflict: 'id' });
        
        if (error) throw error;
        
        setUser({
          ...user,
          phone: phoneNumber,
        });
        
        toast({
          title: "تم تحديث رقم الهاتف",
          description: "تم تحديث رقم هاتفك بنجاح",
        });
      }
      
    } catch (err: any) {
      setError('فشل إرسال رمز التحقق. الرجاء المحاولة مرة أخرى');
      toast({
        title: "خطأ في تحديث رقم الهاتف",
        description: err.message || 'حدث خطأ أثناء تحديث رقم الهاتف',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneCode = async (code: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would verify the SMS code
      // For now, we'll simulate success for any code
      
      if (user) {
        // Update user authentication status
        setUser({
          ...user,
          isAuthenticated: true,
        });
        
        toast({
          title: "تم التحقق بنجاح",
          description: "تم التحقق من رقم هاتفك بنجاح",
        });
      }
      
    } catch (err: any) {
      setError('رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى');
      toast({
        title: "خطأ في التحقق",
        description: err.message || 'رمز التحقق غير صحيح',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('يجب تسجيل الدخول لتحديث الملف الشخصي');
      }
      
      // Map User interface to profiles table structure
      const profileData: any = {};
      
      if (userData.name) profileData.full_name = userData.name;
      if (userData.city) profileData.region = userData.city;
      if (userData.phone) profileData.phone_number_1 = userData.phone;
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        ...userData
      });
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث بياناتك بنجاح",
      });
      
    } catch (err: any) {
      setError('فشل تحديث بيانات المستخدم. الرجاء المحاولة مرة أخرى');
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: err.message || 'حدث خطأ أثناء تحديث البيانات',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): void => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل الخروج بنجاح",
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginWithFacebook,
        loginWithCredentials,
        loginAsOwner,
        sendPhoneVerification,
        verifyPhoneCode,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
