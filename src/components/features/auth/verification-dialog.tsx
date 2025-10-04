"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"

interface VerificationDialogProps {
  email: string
  isOpen: boolean
  onClose: () => void
}

export function VerificationDialog({ email, isOpen, onClose }: VerificationDialogProps) {
  const router = useRouter()

  const handleVerified = () => {
    onClose()
    router.push("/login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Check your email
          </DialogTitle>
          <DialogDescription className="text-center">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>
            <br />
            Please check your email and verify your account to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => router.push("/login")}
          >
            I&apos;ll verify later
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleVerified}
          >
            Yes, I verified my email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 