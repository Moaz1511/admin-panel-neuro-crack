import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthService } from "@/lib/services/auth-service"
import { useAuthStore } from "@/lib/store/auth.store"
import type { ForgotPasswordSchema } from "@/lib/validations/forgot-password-validation"

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setEmail = useAuthStore((state) => state.setEmail)

  const forgotPassword = async (data: ForgotPasswordSchema) => {
    try {
      setIsLoading(true)
      await AuthService.forgotPassword(data.email)
      
      // Store email in global state
      setEmail(data.email)
      toast.success("OTP sent to your email")
      router.push("/verify-otp")
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    forgotPassword,
  }
} 