
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

enum AuthStep {
  INITIAL,
  PHONE_VERIFICATION,
  OTP_VERIFICATION,
  PROFILE_COMPLETION
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { loginWithFacebook, sendPhoneVerification, verifyPhoneCode, updateUserProfile, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStep.INITIAL);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userCity, setUserCity] = useState<string>('نابلس');

  const handleFacebookLogin = async () => {
    await loginWithFacebook();
    setCurrentStep(AuthStep.PHONE_VERIFICATION);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 9) {
      alert('الرجاء إدخال رقم هاتف صحيح');
      return;
    }
    await sendPhoneVerification(phoneNumber);
    setCurrentStep(AuthStep.OTP_VERIFICATION);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      alert('الرجاء إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }
    await verifyPhoneCode(otpCode);
    setCurrentStep(AuthStep.PROFILE_COMPLETION);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) {
      alert('الرجاء إدخال اسمك');
      return;
    }
    await updateUserProfile({ name: userName, city: userCity });
    onClose();
    // Reset state after closing
    setTimeout(() => {
      setCurrentStep(AuthStep.INITIAL);
      setPhoneNumber('');
      setOtpCode('');
      setUserName('');
    }, 300);
  };

  const renderStep = () => {
    switch (currentStep) {
      case AuthStep.INITIAL:
        return (
          <div className="flex flex-col gap-6">
            <Button
              className="w-full gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              <Facebook className="h-5 w-5" />
              تسجيل الدخول باستخدام فيسبوك
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-background text-muted-foreground">أو</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              سيتم تطوير طرق تسجيل دخول أخرى قريباً
            </div>
          </div>
        );

      case AuthStep.PHONE_VERIFICATION:
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="أدخل رقم هاتفك"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                سيتم إرسال رمز تحقق برسالة نصية إلى هذا الرقم
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </Button>
          </form>
        );

      case AuthStep.OTP_VERIFICATION:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">رمز التحقق</Label>
              <div className="flex justify-center py-4">
                <InputOTP
                  value={otpCode}
                  onChange={setOtpCode}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى {phoneNumber}
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري التحقق...' : 'تحقق من الرمز'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setCurrentStep(AuthStep.PHONE_VERIFICATION)}
              disabled={isLoading}
            >
              تغيير رقم الهاتف
            </Button>
          </form>
        );

      case AuthStep.PROFILE_COMPLETION:
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="أدخل اسمك"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                placeholder="أدخل مدينتك"
                value={userCity}
                onChange={(e) => setUserCity(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري الحفظ...' : 'إكمال التسجيل'}
            </Button>
          </form>
        );
    }
  };

  const renderTitle = () => {
    switch (currentStep) {
      case AuthStep.INITIAL:
        return 'تسجيل الدخول إلى حسابك';
      case AuthStep.PHONE_VERIFICATION:
        return 'التحقق من رقم الهاتف';
      case AuthStep.OTP_VERIFICATION:
        return 'إدخال رمز التحقق';
      case AuthStep.PROFILE_COMPLETION:
        return 'استكمال بيانات الملف الشخصي';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{renderTitle()}</DialogTitle>
          <DialogDescription className="text-center">
            {currentStep === AuthStep.INITIAL && 'قم بتسجيل الدخول للاستفادة من جميع مميزات الموقع'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
