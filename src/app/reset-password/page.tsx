"use client"

import { useEffect } from "react"
import { redirect, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/validations/reset-password-validation"
import { useResetPassword } from "@/lib/hooks/use-reset-password"
import { useAuthStore } from "@/lib/store/auth-store"
import Image from "next/image"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import { useState } from "react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const email = useAuthStore((state) => state.email)
  const { isLoading, resetPassword } = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirect to login if no email in store
  useEffect(() => {
    if (!email) {
      redirect("/login")
    }
  }, [email, router])

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = async (values: ResetPasswordSchema) => {
    await resetPassword(values)
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
        <Card className="w-[400px] bg-black/30 backdrop-blur-lg border-blue-500/20 text-white rounded-2xl shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-center text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            disabled={isLoading}
                            {...field}
                            className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            disabled={isLoading}
                            {...field}
                            className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
