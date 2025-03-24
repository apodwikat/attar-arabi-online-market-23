
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user type
export interface User {
  id: string;
  name: string;
  city: string;
  phone: string;
  isAuthenticated: boolean;
}

// Authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithFacebook: () => Promise<void>;
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
        setUser({
          ...user,
          ...userData,
        });
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
