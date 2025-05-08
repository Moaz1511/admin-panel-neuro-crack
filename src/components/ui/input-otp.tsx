"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/styles/tailwind"

const ALLOWED_CHARACTERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function InputOTP({
  className,
  containerClassName,
  maxLength = 6,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
  maxLength?: number
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Handle click on container to focus input
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div onClick={handleContainerClick} className="cursor-text">
      <OTPInput
        ref={inputRef}
        data-slot="input-otp"
        pattern="\d*"
        maxLength={maxLength}
        containerClassName={cn(
          "flex items-center justify-center gap-2 has-disabled:opacity-50",
          containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
        onKeyDown={(e) => {
          // Allow only digits, backspace, arrow keys, and tab
          if (
            !ALLOWED_CHARACTERS.includes(e.key) &&
            !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(e.key)
          ) {
            e.preventDefault()
            return
          }

          // Call the original onKeyDown if provided
          props.onKeyDown?.(e)
        }}
      />
    </div>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center justify-center gap-4", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  
  // Safely handle undefined context or slots
  if (!inputOTPContext?.slots || !inputOTPContext.slots[index]) {
    return (
      <div
        data-slot="input-otp-slot"
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-lg border bg-white text-center text-lg font-medium shadow-sm transition-all",
          "border-slate-100",
          className
        )}
        {...props}
      />
    )
  }

  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-lg border bg-white text-center text-lg font-medium transition-all",
        "border-slate-100",
        "hover:border-slate-200",
        "focus-within:border-slate-200 focus-within:shadow-[0_0_0_1px_rgba(0,0,0,0.05)]",
        isActive && "border-slate-200 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-8 w-px bg-slate-400 duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
