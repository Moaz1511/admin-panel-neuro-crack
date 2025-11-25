import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthService } from "@/lib/services/auth-service"
import type { VerifyOtpSchema } from "@/lib/validations/verify-otp-validation"
import { AxiosError } from "axios"
import { useAuthStore } from "@/lib/store/auth-store"

export function useVerifyOtp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const setOtp = useAuthStore((state) => state.setOtp)

  const verifyOtp = async (data: VerifyOtpSchema) => {
    try {
      setIsLoading(true)
      await AuthService.verifyOtp(data.email, data.otp)
      setOtp(data.otp) // Store OTP after successful verification
      toast.success("OTP verified successfully")
      router.push("/reset-password") // Navigate to reset password page
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Invalid OTP. Please try again."
        toast.error(message)
      } else {
        toast.error("Invalid OTP. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async (email: string) => {
    try {
      setIsLoading(true)
      await AuthService.forgotPassword(email)
      toast.success("New OTP sent to your email")
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Failed to resend OTP. Please try again."
        toast.error(message)
      } else {
        toast.error("Failed to resend OTP. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    verifyOtp,
    resendOtp,
  }
} 