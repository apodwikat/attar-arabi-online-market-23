
// Define user type
export interface User {
  id: string;
  name: string;
  city: string;
  phone: string;
  isAuthenticated: boolean;
  isOwner?: boolean;
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithFacebook: () => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  loginAsOwner: () => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<void>;
  verifyPhoneCode: (code: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}
