"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { registerSchema } from "@/lib/validations/auth-input-validation-schema"
import { toast } from "sonner"
import { ZodError } from "zod"
import { errorHandler } from "@/lib/utils/error-handling"
import { useState } from "react"
import { VerificationDialog } from "@/components/features/auth/verification-dialog"

interface SignUpFormActionsProps {
  children: React.ReactNode
}

/**
 * SignUpFormActions Component
 * Client component that handles form submission and validation
 */
export function SignUpFormActions({ children }: SignUpFormActionsProps) {
  const { register, isLoading } = useAuth()
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    try {
      const formData = new FormData(form)
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      }

      // Validate form data with Zod
      const validatedData = registerSchema.parse(data)

      // Register user
      await register({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        role: "USER"
      })

      // Clear form and show verification dialog
      form.reset()
      setRegisteredEmail(validatedData.email)
      setShowVerification(true)
    } catch (error) {
      if (error instanceof ZodError) {
        // Show the first validation error
        toast.error(error.errors[0].message)
      } else {
        const appError = errorHandler.handle(error)
        toast.error(appError.message)
      }
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {children}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <VerificationDialog 
        email={registeredEmail}
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
      />
    </>
  )
} 