import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthService } from "@/lib/services/auth-service"
import { useAuthStore } from "@/lib/store/auth.store"
import type { ResetPasswordSchema } from "@/lib/validations/reset-password-validation"
import { AxiosError } from "axios"

export function useResetPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { email, otp, clearAll } = useAuthStore()

  const resetPassword = async (data: ResetPasswordSchema) => {
    if (!email || !otp) {
      toast.error("Invalid session. Please try again")
      router.replace("/forgot-password")
      return
    }

    try {
      setIsLoading(true)
      await AuthService.resetPassword(email, otp, data.newPassword)
      toast.success("Password reset successfully")
      clearAll() // Clear stored email and OTP
      router.replace("/login")
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Failed to reset password. Please try again."
        toast.error(message)
      } else {
        toast.error("Failed to reset password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    resetPassword,
  }
} 