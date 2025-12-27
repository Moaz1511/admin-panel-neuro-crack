'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SignUpFormActions } from "@/modules/auth/signup/signup-form-actions"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from '@/lib/hooks/use-auth'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppConstants } from "@/lib/utils/app-constants";

export default function SignUpPage() {
  const { isAuthLoading, isAuthenticated } = useAuth()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(AppConstants.routes.home);
    }
  }, [isAuthenticated, router]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-svh w-full bg-gray-950">
      <Image
        src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=1200&auto=format&fit=crop"
        alt="Abstract dark background"
        layout="fill"
        objectFit="cover"
        className="opacity-10"
      />
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg">
          <Card className="bg-black/30 backdrop-blur-lg border-blue-500/20 rounded-2xl shadow-lg overflow-hidden p-0 text-white">
            <CardContent className="p-8 md:p-12">
              <SignUpFormActions>
                <div className="flex flex-col items-center text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">Create an Account</h1>
                  <p className="text-gray-300 text-balance">
                    Join NeuroCrack and start your journey.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password"  className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password" 
                        required
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full text-gray-400 hover:text-white"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword"  className="text-gray-300">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password" 
                        required
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                       <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-400 mt-6">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                    Login here
                  </Link>
                </div>
              </SignUpFormActions>
            </CardContent>
          </Card>
          <div className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-gray-400 hover:underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  )
} 