import React from "react";
import {Link} from 'react-router-dom'
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const { register, isRegistering } = useAuthStore();
  const validateForm = () => {

    if (!formData.fullname.trim()) return toast.error("Full name is required")
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S\S.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if (!formData.password) return toast.error("Password is required")
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long")

    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm()

    if(success === true) register(formData)
  }
  return (
    <div className="min-h-screen content-center">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Logo */}
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-6 text-primary"/>
            </div>
            <h1>Create Account</h1>
          </div>

          {/* Name Field */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="Rokas Rozga"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40"/>
                </div>
                <input 
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="rokasrozgadev@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40"/>
                </div>
                <input 
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

              <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
              </div>
            </div>
            
            {/* Submit form button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isRegistering}>
              {isRegistering ? 
              (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : 
              (
              <>
                Create account
              </>
              )}
            </button>
          </form>
          
          {/* Already has account */}
          <div className="text-center">
            <p className="text-base-content/60">
            Already have an account?</p>
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
