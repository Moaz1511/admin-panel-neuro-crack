"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { loginSchema } from "@/lib/validations/auth-input-validation-schema"
import { toast } from "sonner"
import { ZodError } from "zod"
import { AxiosError } from "axios"

interface ApiResponse {
  message: string
}

interface LoginFormActionsProps {
  children: React.ReactNode
}

/**
 * LoginFormActions Component
 * Handles login form submission, validation, and error handling
 */
export function LoginFormActions({ children }: LoginFormActionsProps) {
  const { login, isAuthLoading } = useAuth()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("Submitting login form");

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }

      // Validate form data
      const validatedData = loginSchema.parse(data)

      // Attempt login
      await login(validatedData)
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof ZodError) {
        // Show validation error
        toast.error(error.errors[0].message)
      } else if (error instanceof AxiosError) {
        // Show API error message
        const message = (error.response?.data as ApiResponse)?.message || 'Login failed'
        toast.error(message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 p-6 md:p-8">
      {children}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isAuthLoading}
        aria-label={isAuthLoading ? "Logging in..." : "Login"}
      >
        {isAuthLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}