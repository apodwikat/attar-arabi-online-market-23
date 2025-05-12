
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User, AuthContextType } from "@/types/auth.types";
import { fetchUserProfile, mapUserFromProfile, loginWithEmailPassword, 
  loginWithFacebookOAuth, updateProfile, signOut } from '@/services/auth.service';

// Create context
export const AuthContext = createContext<AuthContextType | null>(null);

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
          const { profile, adminData, error } = await fetchUserProfile(session.user.id);
          
          if (error) {
            throw error;
          }
          
          // Create user object
          const userData = mapUserFromProfile(session.user.id, profile, adminData);
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
          const { profile, adminData, error } = await fetchUserProfile(session.user.id);
          
          if (!error) {
            const userData = mapUserFromProfile(session.user.id, profile, adminData);
            setUser(userData);
          }
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
      const { data, error: signInError } = await loginWithEmailPassword(email, password);
      
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
      const { data, error: signInError } = await loginWithEmailPassword(
        'adweikat12@gmail.com',
        'Abood@1234'  // Note: In a production app, you shouldn't hardcode passwords
      );
      
      if (signInError) throw signInError;
      
      // Check if the user is actually an owner in the admin_users table
      const { profile, adminData, error: fetchError } = await fetchUserProfile(data.user?.id || '');
      
      if (fetchError || !adminData || adminData.role !== 'owner') {
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
      const { data, error } = await loginWithFacebookOAuth();
      
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
        const { error } = await updateProfile(user.id, {
          phone_number_1: phoneNumber
        });
        
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
      const { error } = await updateProfile(user.id, profileData);
      
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

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut();
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
