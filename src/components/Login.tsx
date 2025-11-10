import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  UserPlus,
  LogIn,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Mock user database for demonstration
  const mockUsers = [
    {
      email: 'juan@lifecraft.ph',
      password: 'survival123', // In real app, this would be hashed
      userData: {
        id: 1,
        name: 'Juan Dela Cruz',
        email: 'juan@lifecraft.ph',
        avatar: 'JD',
        level: 8,
        points: 156,
        joinedDate: '2024-01-15',
        achievements: ['First Aid Expert', 'Water Purification Master', 'Community Helper'],
        completedGuides: 47,
        contributedGuides: 12,
        communityRank: 'Advanced Survivor'
      }
    },
    {
      email: 'maria@lifecraft.ph',
      password: 'prepare2024',
      userData: {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@lifecraft.ph',
        avatar: 'MS',
        level: 5,
        points: 89,
        joinedDate: '2024-02-20',
        achievements: ['Community Helper'],
        completedGuides: 23,
        contributedGuides: 8,
        communityRank: 'Intermediate Prepper'
      }
    }
  ];

  const validateLoginForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Step 1: Check if inputs are empty
    if (!loginForm.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!isValidEmail(loginForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!loginForm.password.trim()) {
      newErrors.password = 'Please enter your password';
    }

    if (!loginForm.email.trim() && !loginForm.password.trim()) {
      newErrors.general = 'Please enter your email and password';
    }

    return newErrors;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    
    // Step 1: Validate inputs
    const validationErrors = validateLoginForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      if (validationErrors.general) {
        toast.error(validationErrors.general);
      }
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Step 2: Database check - look for user
      const foundUser = mockUsers.find(user => 
        user.email.toLowerCase() === loginForm.email.toLowerCase()
      );

      if (!foundUser) {
        // Step 3a: User not found
        setErrors({ email: 'Account does not exist' });
        toast.error('Account not found. Please check your email or create a new account.');
        setIsLoading(false);
        return;
      }

      // Step 3b: Check password (in real app, compare hashed password)
      if (foundUser.password !== loginForm.password) {
        setErrors({ password: 'Invalid password' });
        toast.error('Invalid password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Step 4: Authentication successful
      toast.success('Welcome back to LifeCraft!');
      
      // Step 5: Create session/handle remember me
      if (rememberMe) {
        localStorage.setItem('lifecraft_remember', 'true');
        localStorage.setItem('lifecraft_user', JSON.stringify(foundUser.userData));
      }
      
      onLogin(foundUser.userData);
      setIsLoading(false);
    }, 1000);
  };

  const validateRegisterForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!registerForm.name.trim()) {
      newErrors.name = 'Please enter your full name';
    } else if (registerForm.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!registerForm.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!isValidEmail(registerForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!registerForm.password.trim()) {
      newErrors.password = 'Please create a password';
    } else if (registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!registerForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    
    // Step 1: Validate inputs
    const validationErrors = validateRegisterForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Step 2: Check if email already exists
      const existingUser = mockUsers.find(user => 
        user.email.toLowerCase() === registerForm.email.toLowerCase()
      );

      if (existingUser) {
        setErrors({ email: 'An account with this email already exists' });
        toast.error('Account already exists. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      // Step 3: Create new user
      const userData = {
        id: mockUsers.length + 1,
        name: registerForm.name,
        email: registerForm.email,
        avatar: registerForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        level: 1,
        points: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        achievements: [],
        completedGuides: 0,
        contributedGuides: 0,
        communityRank: 'Beginner'
      };

      toast.success('Welcome to LifeCraft! Your survival journey begins now.');
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 999,
      name: 'Demo User',
      email: 'demo@lifecraft.ph',
      avatar: 'DU',
      level: 8,
      points: 156,
      joinedDate: '2024-01-15',
      achievements: ['First Aid Expert', 'Water Purification Master', 'Community Helper'],
      completedGuides: 47,
      contributedGuides: 12,
      communityRank: 'Advanced Survivor'
    };
    toast.success('Demo mode activated! Explore LifeCraft features.');
    onLogin(demoUser);
  };

  const handleForgotPassword = () => {
    if (!loginForm.email.trim()) {
      toast.error('Please enter your email address first');
      return;
    }
    
    if (!isValidEmail(loginForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if email exists in our mock database
    const userExists = mockUsers.some(user => 
      user.email.toLowerCase() === loginForm.email.toLowerCase()
    );

    if (!userExists) {
      toast.error('No account found with this email address');
      return;
    }

    toast.success('Password reset link sent to your email!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome to LifeCraft</h1>
            <p className="text-muted-foreground">Your Survival & Sustainability Ecosystem</p>
          </div>
        </div>

        <Card>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* General Error Alert */}
                  {errors.general && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email (try: juan@lifecraft.ph)"
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        value={loginForm.email}
                        onChange={(e) => {
                          setLoginForm({ ...loginForm, email: e.target.value });
                          if (errors.email) {
                            setErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={handleForgotPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password (try: survival123)"
                        className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                        value={loginForm.password}
                        onChange={(e) => {
                          setLoginForm({ ...loginForm, password: e.target.value });
                          if (errors.password) {
                            setErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label 
                      htmlFor="remember-me" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDemoLogin}
                  >
                    Try Demo Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </CardTitle>
                  <CardDescription>
                    Join the LifeCraft community today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                        value={registerForm.name}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, name: e.target.value });
                          if (errors.name) {
                            setErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        value={registerForm.email}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, email: e.target.value });
                          if (errors.email) {
                            setErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                          if (errors.password) {
                            setErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                        value={registerForm.confirmPassword}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                          if (errors.confirmPassword) {
                            setErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }
                        }}
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Test Credentials Helper */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="text-sm font-medium mb-2">Test Accounts:</div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <strong>Advanced User:</strong> juan@lifecraft.ph / survival123
            </div>
            <div>
              <strong>New User:</strong> maria@lifecraft.ph / prepare2024
            </div>
            <div className="text-xs mt-2 text-muted-foreground">
              Or use the "Try Demo Account" button for instant access
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}