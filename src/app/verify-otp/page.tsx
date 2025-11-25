"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VerifyOtpSchema, verifyOtpSchema } from "@/lib/validations/verify-otp-validation"
import { useVerifyOtp } from "@/lib/hooks/use-verify-otp"
import { useAuthStore } from "@/lib/store/auth-store"
import Image from "next/image"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"

export default function VerifyOtpPage() {
  const router = useRouter()
  const email = useAuthStore((state) => state.email)
  const clearEmail = useAuthStore((state) => state.clearEmail)
  const { isLoading, verifyOtp, resendOtp } = useVerifyOtp()
  const [countdown, setCountdown] = useState(30)

  // Redirect to login if no email in store
  useEffect(() => {
    if (!email) {
      router.replace("/login")
    }
  }, [email, router])

  // Prevent going back after OTP verification
  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href)
      clearEmail() // Clear email from store when navigating back
      router.replace("/login")
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [router, clearEmail])

  const form = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
      email: email || "",
    },
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendOtp = async () => {
    if (countdown === 0 && email) {
      await resendOtp(email)
      setCountdown(30)
    }
  }

  const handleSubmit = async (values: VerifyOtpSchema) => {
    if (!email) return
    await verifyOtp({ email, otp: values.otp })
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
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-300">
                Enter the 6-digit code sent to
              </p>
              {email && <p className="text-sm font-medium text-blue-400">{email}</p>}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4 flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={form.watch("otp")}
                    onChange={(value) => form.setValue("otp", value)}
                    render={({ slots }) => (
                      <InputOTPGroup className="gap-2">
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} index={index} className="bg-black/50 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500">
                            {slot.char ? (
                              <div className="text-xl font-semibold">
                                {slot.char}
                              </div>
                            ) : slot.hasFakeCaret ? (
                              <div className="animate-pulse w-px h-8 bg-blue-400 duration-1000" />
                            ) : null}
                          </InputOTPSlot>
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                {form.formState.errors.otp && (
                  <p className="text-sm text-red-500 text-center">
                    {form.formState.errors.otp.message}
                  </p>
                )}

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-400">
                      Didn&apos;t receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm font-medium text-blue-400 hover:text-blue-300"
                      disabled={countdown > 0 || isLoading}
                      onClick={handleResendOtp}
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}