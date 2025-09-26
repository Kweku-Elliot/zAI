
import React, { useState, useContext } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, Facebook, Twitter, Github } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
        const [, setLocation] = useLocation();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const [emailError, setEmailError] = useState('');
        const [passwordError, setPasswordError] = useState('');
        const { signIn, authLoading, signInWithGoogle, signInWithGitHub } = useContext(AuthContext);
        const [formError, setFormError] = useState('');

        const validateForm = () => {
                let isValid = true;
                setEmailError('');
                setPasswordError('');
                if (!email) {
                        setEmailError('Email is required');
                        isValid = false;
                } else if (!/\S+@\S+\.\S+/.test(email)) {
                        setEmailError('Please enter a valid email');
                        isValid = false;
                }
                if (!password) {
                        setPasswordError('Password is required');
                        isValid = false;
                } else if (password.length < 6) {
                        setPasswordError('Password must be at least 6 characters');
                        isValid = false;
                }
                return isValid;
        };

        const handleLogin = async () => {
                console.log('Login button clicked');
                if (validateForm()) {
                        setFormError('');
                        try {
                                console.log('Calling signIn with', email, password);
                                                                const res = await signIn(email, password);
                                                                console.log('signIn result:', res);
                                                                if (res?.error) setFormError(res.error.message || 'Login failed');
                                                                else if (res?.user) {
                                                                        setLocation('/home');
                                                                }
                        } catch (err: any) {
                                console.error('Login error:', err);
                                setFormError(err?.message ?? 'Login failed');
                        }
                } else {
                        console.log('Validation failed');
                }
        };

        const handleSocialLogin = async (provider: string) => {
                try {
                        if (provider === 'Google') {
                                await signInWithGoogle();
                        } else if (provider === 'GitHub') {
                                await signInWithGitHub();
                        } else {
                                alert(`Login with ${provider} is not yet implemented`);
                        }
                } catch (err: any) {
                        setFormError(err?.message ?? `${provider} login failed`);
                }
        };

        return (
                <div className="min-h-screen flex items-center justify-center bg-background mobile-safe-container">
                        <div className="w-full max-w-md px-6 py-12 bg-card rounded-xl shadow">
                                {/* Header */}
                                <div className="mb-12 text-center">
                                        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                                        <p className="text-muted-foreground">Sign in to continue your journey</p>
                                </div>
                                {/* Login Form */}
                                <div className="bg-card rounded-2xl p-6 shadow-lg mb-8">
                                        {/* Email Field */}
                                        <div className="mb-5">
                                                <div className="flex items-center border border-border rounded-xl px-4 py-3 bg-background">
                                                        <Mail size={20} color="#6B7280" />
                                                        <input
                                                                className="flex-1 ml-3 text-foreground outline-none bg-transparent"
                                                                type="email"
                                                                placeholder="Email address"
                                                                value={email}
                                                                onChange={e => setEmail(e.target.value)}
                                                                autoCapitalize="none"
                                                        />
                                                </div>
                                                {emailError && (
                                                        <div className="text-red-500 text-sm mt-1 ml-1">{emailError}</div>
                                                )}
                                        </div>
                                        {/* Password Field */}
                                        <div className="mb-6">
                                                <div className="flex items-center border border-border rounded-xl px-4 py-3 bg-background">
                                                        <Lock size={20} color="#6B7280" />
                                                        <input
                                                                className="flex-1 ml-3 text-foreground outline-none bg-transparent"
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Password"
                                                                value={password}
                                                                onChange={e => setPassword(e.target.value)}
                                                        />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2">
                                                                {showPassword ? (
                                                                        <EyeOff size={20} color="#6B7280" />
                                                                ) : (
                                                                        <Eye size={20} color="#6B7280" />
                                                                )}
                                                        </button>
                                                </div>
                                                {passwordError && (
                                                        <div className="text-red-500 text-sm mt-1 ml-1">{passwordError}</div>
                                                )}
                                        </div>
                                        {/* Forgot Password */}
                                        <div className="mb-6 text-right">
                                                <button type="button" className="text-primary font-medium">Forgot Password?</button>
                                        </div>
                                        {/* Login Button */}
                                        <button
                                                className="w-full bg-primary rounded-xl py-4 text-primary-foreground font-bold text-lg mb-6"
                                                onClick={handleLogin}
                                                disabled={authLoading}
                                                type="button"
                                        >
                                                Sign In
                                        </button>
                                        {formError && <div className="text-red-500 text-sm mt-1">{formError}</div>}
                                        {/* Divider */}
                                        <div className="flex items-center mb-6">
                                                <div className="flex-1 h-px bg-border" />
                                                <span className="text-muted-foreground mx-4">OR</span>
                                                <div className="flex-1 h-px bg-border" />
                                        </div>
                                        {/* Social Login Buttons */}
                                        <div className="flex justify-between mb-8">
                                                <button
                                                        className="flex-1 mx-1 bg-card border border-border rounded-xl py-3 flex items-center justify-center"
                                                        type="button"
                                                        onClick={() => handleSocialLogin('Facebook')}
                                                >
                                                        <Facebook size={24} color="#3B82F6" />
                                                </button>
                                                <button
                                                        className="flex-1 mx-1 bg-card border border-border rounded-xl py-3 flex items-center justify-center"
                                                        type="button"
                                                        onClick={() => handleSocialLogin('Twitter')}
                                                >
                                                        <Twitter size={24} color="#3B82F6" />
                                                </button>
                                                <button
                                                        className="flex-1 mx-1 bg-card border border-border rounded-xl py-3 flex items-center justify-center"
                                                        type="button"
                                                        onClick={() => handleSocialLogin('GitHub')}
                                                >
                                                        <Github size={24} color="#374151" />
                                                </button>
                                        </div>
                                </div>
                                {/* Sign Up Link */}
                                <div className="flex justify-center">
                                        <span className="text-muted-foreground">Don't have an account? </span>
                                        <button type="button" className="text-primary font-bold ml-1" onClick={() => setLocation('/signup')}>Sign Up</button>
                                </div>
                        </div>
                        {/* Safe area bottom padding */}
                        <div className="pb-[env(safe-area-inset-bottom)]"></div>
                </div>
        );
}
