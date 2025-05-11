
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user data', err);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // New method for email/password login
  const loginWithCredentials = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would validate against a backend
      // For now, simulate successful login
      
      // Get existing profile from localStorage if available
      const storedProfile = localStorage.getItem('userProfile');
      let profileData = {}; 
      
      if (storedProfile) {
        profileData = JSON.parse(storedProfile);
      }
      
      // Create user object with email (would come from backend in real app)
      const userData: User = {
        id: `user-${Date.now()}`, // Generate temporary ID
        name: (profileData as any).fullName || email.split('@')[0],
        city: (profileData as any).region || '',
        phone: (profileData as any).phone || '',
        isAuthenticated: true
      };
      
      // Set the authenticated user
      setUser(userData);
      
      console.log('User logged in successfully:', userData);
      
    } catch (err) {
      setError('فشل تسجيل الدخول. الرجاء التحقق من بريدك الإلكتروني وكلمة المرور');
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Owner login method
  const loginAsOwner = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create owner user object
      const ownerData: User = {
        id: 'owner-1',
        name: 'Admin',
        city: '',
        phone: '',
        isAuthenticated: true,
        isOwner: true
      };
      
      // Set the authenticated owner
      setUser(ownerData);
      
      console.log('Owner logged in successfully');
      
    } catch (err) {
      setError('فشل تسجيل الدخول كمدير. الرجاء المحاولة مرة أخرى');
      console.error('Owner login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual Facebook login integration
      
      // For now, show an alert that this feature is in development
      alert('ميزة تسجيل الدخول عبر فيسبوك قيد التطوير');
      
      // Mock successful login for testing UI
      // setUser({
      //   id: 'facebook-user-id',
      //   name: 'مستخدم تجريبي',
      //   city: 'نابلس',
      //   phone: '',
      //   isAuthenticated: false, // Not fully authenticated until phone verification
      // });
      
    } catch (err) {
      setError('فشل تسجيل الدخول باستخدام فيسبوك. الرجاء المحاولة مرة أخرى');
      console.error('Facebook login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneVerification = async (phoneNumber: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual SMS verification service
      
      // For now, show an alert that this feature is in development
      alert(`ميزة التحقق عبر الرسائل النصية قيد التطوير. رقم الهاتف: ${phoneNumber}`);
      
      // Update user phone
      if (user) {
        setUser({
          ...user,
          phone: phoneNumber,
        });
      }
      
    } catch (err) {
      setError('فشل إرسال رمز التحقق. الرجاء المحاولة مرة أخرى');
      console.error('SMS verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneCode = async (code: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual verification code validation
      
      // For now, show an alert that this feature is in development
      alert(`ميزة التحقق من الرمز قيد التطوير. الرمز: ${code}`);
      
      // Update user authentication status
      if (user) {
        setUser({
          ...user,
          isAuthenticated: true,
        });
      }
      
    } catch (err) {
      setError('رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى');
      console.error('Code verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update user data
      if (user) {
        const updatedUser = {
          ...user,
          ...userData,
        };
        setUser(updatedUser);
      } else {
        // If no user exists yet, create one with the provided data
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name || '',
          city: userData.city || '',
          phone: userData.phone || '',
          isAuthenticated: true,
        };
        setUser(newUser);
      }
      
    } catch (err) {
      setError('فشل تحديث بيانات المستخدم. الرجاء المحاولة مرة أخرى');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
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
