import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthService } from "@/lib/services/auth-service"
import type { ForgotPasswordSchema } from "@/lib/validations/forgot-password-validation"

export function useForgotPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const forgotPassword = async (data: ForgotPasswordSchema) => {
    try {
      setIsLoading(true)
      await AuthService.forgotPassword(data.email)
      toast.success("Check your email for the OTP code")
      router.push("/verify-otp")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    forgotPassword,
  }
} 