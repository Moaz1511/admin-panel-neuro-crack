'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AppConstants } from '@/lib/utils/app-constants'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Illustration */}
        <div className="relative w-full h-64 mx-auto">
          <Image
            src="https://illustrations.popsy.co/white/resistance-band.svg"
            alt="404 Illustration"
            fill
            className="object-contain dark:brightness-90"
            priority
          />
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be
            sure to check your spelling.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            Go back
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={AppConstants.routes.home}>
              Take me home
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <p className="text-sm text-muted-foreground mt-8">
          If you believe this is a mistake, please{' '}
          <Link 
            href="/contact" 
            className="text-primary hover:underline underline-offset-4"
          >
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  )
} 