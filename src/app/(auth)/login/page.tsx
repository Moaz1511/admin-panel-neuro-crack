'use client'

import Image from "next/image";
import { useAuth } from '@/lib/hooks/use-auth'
import { LoginFormActions } from "@/modules/auth/login/login-form-actions"
import { CardContent, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppConstants } from "@/lib/utils/app-constants";

export default function LoginPage() {
  const { isAuthLoading, isAuthenticated } = useAuth()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="w-full max-w-4xl">
          <Card className="bg-black/30 backdrop-blur-lg border-blue-500/20 rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="grid md:grid-cols-2 p-0">
              <div className="p-8 md:p-12 flex flex-col justify-center text-white">
                <LoginFormActions>
                  <div className="flex flex-col items-start text-left mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                      NeuroCrack
                    </h1>
                    <p className="text-gray-300 text-balance">
                      Sign in to access your account.
                    </p>
                  </div>
                  <div className="grid gap-4">
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
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password"  className="text-gray-300">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input 
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                  <div className="text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                      Sign up
                    </Link>
                  </div>
                </LoginFormActions>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute inset-6">
                  <Image
                    src="https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1200&auto=format&fit=crop"
                    alt="Futuristic technology"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl opacity-75"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-gray-400 hover:underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}

