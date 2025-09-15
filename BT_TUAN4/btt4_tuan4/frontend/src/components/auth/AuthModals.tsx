/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { login, forgotPassword, resetPassword } from '@/redux/userSlice'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'otp';
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        if (mode === 'login') {
          const res = await dispatch(login({ email: formData.email, password: formData.password }));
          console.log('login action result', res);
          if ((res as any)?.meta?.requestStatus === 'fulfilled') {
            toast({ title: 'Đăng nhập thành công', duration: 2000 })
            onClose()
          }
        }

        if (mode === 'forgot') {
          await dispatch(forgotPassword({ email: formData.email }))
          toast({ title: 'Mã OTP đã được gửi (nếu tồn tại tài khoản)', duration: 3000 })
          setMode('otp')
        }

        if (mode === 'otp') {
          await dispatch(resetPassword({ email: formData.email, token: otp, newPassword: formData.password }))
          toast({ title: 'Mật khẩu đã được đặt lại', duration: 2500 })
          onClose()
        }

        if (mode === 'register') {
          await api.post('/users/register', { email: formData.email, password: formData.password, username: formData.email })
          toast({ title: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực', duration: 3000 })
          onClose()
        }
      } catch (err: unknown) {
        console.error(err)
        toast({ title: 'Lỗi', description: 'Có lỗi xảy ra', duration: 3000 })
      }
    })()
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
    setOtp('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    resetForm();
  };

  const renderLoginForm = () => (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Nhập thông tin để đăng nhập vào tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300" />
              <Label htmlFor="remember" className="text-sm">Ghi nhớ đăng nhập</Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="px-0 font-normal text-primary"
              onClick={() => switchMode('forgot')}
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Button
              type="button"
              variant="link"
              className="px-0 font-normal text-primary"
              onClick={() => switchMode('register')}
            >
              Đăng ký ngay
            </Button>
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const renderRegisterForm = () => (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Tạo tài khoản mới để bắt đầu mua sắm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Nguyễn"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Văn A"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="rounded border-gray-300" required />
            <Label htmlFor="terms" className="text-sm">
              Tôi đồng ý với{' '}
              <Button type="button" variant="link" className="px-0 py-0 h-auto font-normal text-primary">
                Điều khoản dịch vụ
              </Button>
              {' '}và{' '}
              <Button type="button" variant="link" className="px-0 py-0 h-auto font-normal text-primary">
                Chính sách bảo mật
              </Button>
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Đăng ký
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Button
              type="button"
              variant="link"
              className="px-0 font-normal text-primary"
              onClick={() => switchMode('login')}
            >
              Đăng nhập ngay
            </Button>
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const renderForgotPasswordForm = () => (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Gửi mã OTP
          </Button>
        </form>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="px-0 font-normal text-primary"
            onClick={() => switchMode('login')}
          >
            ← Quay lại đăng nhập
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderOTPForm = () => (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Xác thực OTP</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Nhập mã OTP 6 số được gửi về email{' '}
          <span className="font-medium text-foreground">{formData.email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
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

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Không nhận được mã?{' '}
              <Button
                type="button"
                variant="link"
                className="px-0 py-0 h-auto font-normal text-primary"
              >
                Gửi lại mã OTP
              </Button>
            </p>
            <p className="text-xs text-muted-foreground">
              Mã OTP sẽ hết hạn sau <span className="font-medium text-destructive">05:00</span>
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={otp.length !== 6}>
            Xác thực
          </Button>
        </form>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="px-0 font-normal text-primary"
            onClick={() => switchMode('login')}
          >
            ← Quay lại đăng nhập
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        {mode === 'login' && renderLoginForm()}
        {mode === 'register' && renderRegisterForm()}
        {mode === 'forgot' && renderForgotPasswordForm()}
        {mode === 'otp' && renderOTPForm()}
      </DialogContent>
    </Dialog>
  );
};