"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VerifyOtpSchema, verifyOtpSchema } from "@/lib/validations/verify-otp-validation"
import { useVerifyOtp } from "@/lib/hooks/use-verify-otp"
import { useAuthStore } from "@/lib/store/auth.store"

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
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px] border-none shadow-none">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify OTP
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to
            </p>
            {email && <p className="text-sm font-medium">{email}</p>}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <InputOTP
                  maxLength={6}
                  value={form.watch("otp")}
                  onChange={(value) => form.setValue("otp", value)}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} index={index}>
                          {slot.char ? (
                            <div className="text-xl font-semibold text-slate-900">
                              {slot.char}
                            </div>
                          ) : slot.hasFakeCaret ? (
                            <div className="animate-pulse w-px h-8 bg-slate-400 duration-1000" />
                          ) : null}
                        </InputOTPSlot>
                      ))}
                    </InputOTPGroup>
                  )}
                />
                {form.formState.errors.otp && (
                  <p className="text-sm text-red-500 text-center">
                    {form.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B]"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm font-medium"
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
  )
}