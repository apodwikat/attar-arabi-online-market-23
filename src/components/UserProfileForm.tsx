
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserProfileFormProps {
  onSuccess?: () => void;
}

const UserProfileForm = ({ onSuccess }: UserProfileFormProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const formSchema = z.object({
    fullName: z.string().min(3, t('fullNameRequired')),
    region: z.string().min(1, t('regionRequired')),
    address: z.string().min(3, t('addressRequired')),
    phone: z.string().min(9, t('invalidPhone')),
    phone2: z.string().optional(),
    socialMedia: z.string().min(1, t('socialMediaRequired')),
    socialMediaType: z.string().min(1, t('socialMediaTypeRequired')),
    deliveryLocation: z.string().min(1, t('deliveryLocationRequired')),
    preferredContact: z.string().min(1, t('preferredContactRequired')),
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Get existing profile data from localStorage
  const getExistingProfile = () => {
    try {
      const profileData = localStorage.getItem('userProfile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  const existingProfile = getExistingProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: existingProfile?.fullName || user?.name || '',
      region: existingProfile?.region || user?.city || '',
      address: existingProfile?.address || '',
      phone: existingProfile?.phone || user?.phone || '',
      phone2: existingProfile?.phone2 || '',
      socialMedia: existingProfile?.socialMedia || '',
      socialMediaType: existingProfile?.socialMediaType || 'facebook',
      deliveryLocation: existingProfile?.deliveryLocation || 'westBank',
      preferredContact: existingProfile?.preferredContact || 'whatsapp',
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.setValue('fullName', user.name || form.getValues('fullName'));
      form.setValue('region', user.city || form.getValues('region'));
      form.setValue('phone', user.phone || form.getValues('phone'));
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Update user in auth context
      await updateUserProfile({
        name: values.fullName,
        city: values.region,
        phone: values.phone,
      });
      
      // Save detailed profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify(values));
      
      toast({
        title: t('profileUpdated'),
        description: t('profileUpdatedDesc'),
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t('error'),
        description: t('profileUpdateError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Don't render form if user isn't logged in
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">{t('profile')}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fullName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Region Field */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('region')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phoneNumber')}</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number 2 Field (Optional) */}
          <FormField
            control={form.control}
            name="phone2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phoneNumber2')}</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social Media Type Field */}
          <FormField
            control={form.control}
            name="socialMediaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('socialMediaType')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('socialMediaType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social Media Username Field */}
          <FormField
            control={form.control}
            name="socialMedia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('socialMedia')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preferred Contact Method */}
          <FormField
            control={form.control}
            name="preferredContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('preferredContact')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('preferredContact')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Location Field */}
          <FormField
            control={form.control}
            name="deliveryLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('deliveryLocation')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('deliveryLocation')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="westBank">{t('westBank')} - ₪15</SelectItem>
                    <SelectItem value="jerusalem">{t('jerusalem')} - ₪25</SelectItem>
                    <SelectItem value="abuGhoush">{t('abuGhoush')} - ₪40</SelectItem>
                    <SelectItem value="lands48">{t('lands48')} - ₪60</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading}
          >
            {isLoading ? t('updating') : t('updateProfile')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;
