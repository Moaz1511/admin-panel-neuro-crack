"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ForgotPasswordSchema, forgotPasswordSchema } from "@/lib/validations/forgot-password-validation"
import { useForgotPassword } from "@/lib/hooks/use-forgot-password"
import Image from "next/image"

// Import your UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const { isLoading, forgotPassword } = useForgotPassword()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

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
            <CardTitle className="text-2xl font-bold text-center text-white">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your email and we&apos;ll send you a code to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(forgotPassword)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          disabled={isLoading}
                          {...field}
                          className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </div>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}