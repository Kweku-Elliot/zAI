
import React, { useState, useContext } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, User, Facebook, Twitter, Github } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function SignupPage() {
	const [, setLocation] = useLocation();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [termsAccepted, setTermsAccepted] = useState(false);
	const { signUp, authLoading } = useContext(AuthContext);
	const [formError, setFormError] = useState('');

	const validateForm = () => {
		let isValid = true;
		setNameError('');
		setEmailError('');
		setPasswordError('');
		if (!name) {
			setNameError('Name is required');
			isValid = false;
		} else if (name.length < 2) {
			setNameError('Name must be at least 2 characters');
			isValid = false;
		}
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
		if (!termsAccepted) {
			alert('Please accept the terms and conditions');
			isValid = false;
		}
		return isValid;
	};

	const handleSignup = async () => {
		if (validateForm()) {
			setFormError('');
			try {
				const res = await signUp(name, email, password);
				if (res?.error) setFormError(res.error.message || 'Signup failed');
				else alert('Account created successfully! Please verify your email if required.');
			} catch (err: any) {
				setFormError(err?.message ?? 'Signup failed');
			}
		}
	};

	const handleSocialSignup = (provider: string) => {
		alert(`Signup with ${provider} would be implemented here`);
	};

		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
				<div className="w-full max-w-md px-6 py-8">
				{/* Header */}
						<div className="mb-8 text-center">
							<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Create Account</h1>
							<p className="text-gray-600 dark:text-gray-400">Join us today and start your journey</p>
						</div>
				{/* Signup Form */}
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
					{/* Name Field */}
					<div className="mb-5">
						  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900">
							<User size={20} color="#6B7280" />
										<input
											className="flex-1 ml-3 text-gray-800 dark:text-gray-100 outline-none bg-transparent"
								type="text"
								placeholder="Full name"
								value={name}
								onChange={e => setName(e.target.value)}
								autoCapitalize="words"
							/>
						</div>
						{nameError && (
							<div className="text-red-500 text-sm mt-1 ml-1">{nameError}</div>
						)}
					</div>
					{/* Email Field */}
					<div className="mb-5">
						  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900">
							<Mail size={20} color="#6B7280" />
										<input
											className="flex-1 ml-3 text-gray-800 dark:text-gray-100 outline-none bg-transparent"
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
					<div className="mb-4">
						  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900">
							<Lock size={20} color="#6B7280" />
										<input
											className="flex-1 ml-3 text-gray-800 dark:text-gray-100 outline-none bg-transparent"
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
					{/* Password Requirements */}
								<div className="mb-5">
									<span className="text-gray-500 dark:text-gray-400 text-sm ml-1">Password must be at least 6 characters</span>
					</div>
					{/* Terms Agreement */}
								<div className="mb-6 flex items-start">
									<button
										type="button"
										className={`h-5 w-5 rounded border-2 mr-3 mt-1 ${termsAccepted ? 'bg-blue-600 dark:bg-blue-700 border-blue-600 dark:border-blue-700' : 'border-gray-300 dark:border-gray-700'}`}
										onClick={() => setTermsAccepted(!termsAccepted)}
									>
										{termsAccepted && (
											<span className="block w-full h-full flex items-center justify-center">
												<span className="block h-1 w-3 bg-white absolute rotate-45" />
												<span className="block h-1 w-3 bg-white absolute -rotate-45" />
											</span>
										)}
									</button>
									<span className="flex-1 text-gray-700 dark:text-gray-300">
										I agree to the <span className="text-blue-600 dark:text-blue-300 font-bold">Terms of Service</span> and <span className="text-blue-600 dark:text-blue-300 font-bold">Privacy Policy</span>
									</span>
					</div>
					{/* Signup Button */}
								<button
									className="w-full bg-blue-600 dark:bg-blue-700 rounded-xl py-4 text-white font-bold text-lg mb-6"
									onClick={handleSignup}
									disabled={authLoading}
									type="button"
								>
									Create Account
								</button>
					{formError && <div className="text-red-500 text-sm mt-1">{formError}</div>}
					{/* Divider */}
								<div className="flex items-center mb-6">
									<div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
									<span className="text-gray-500 dark:text-gray-400 mx-4">OR</span>
									<div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
								</div>
					{/* Social Signup Buttons */}
								<div className="flex justify-between mb-8">
									<button
										className="flex-1 mx-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl py-3 flex items-center justify-center"
										type="button"
										onClick={() => handleSocialSignup('Facebook')}
									>
										<Facebook size={24} color="#3B82F6" />
									</button>
									<button
										className="flex-1 mx-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl py-3 flex items-center justify-center"
										type="button"
										onClick={() => handleSocialSignup('Twitter')}
									>
										<Twitter size={24} color="#3B82F6" />
									</button>
									<button
										className="flex-1 mx-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl py-3 flex items-center justify-center"
										type="button"
										onClick={() => handleSocialSignup('GitHub')}
									>
										<Github size={24} color="#374151" />
									</button>
								</div>
				</div>
				{/* Login Link */}
						<div className="flex justify-center">
							<span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
							<button type="button" className="text-blue-600 dark:text-blue-300 font-bold ml-1" onClick={() => setLocation('/login')}>Sign In</button>
						</div>
			</div>
			{/* Safe area bottom padding */}
			<div className="pb-[env(safe-area-inset-bottom)]"></div>
		</div>
	);
}
