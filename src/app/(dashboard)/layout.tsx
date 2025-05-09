'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/use-auth'

// Import icons
import {
  BookOpen,
  Bell,
  Search,
  Menu,
  Home,
  FileQuestion,
  Upload,
  UserCircle,
  Settings,
  LogOut,
  Brain,
} from 'lucide-react'

// Import UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// Navigation items configuration
const navigationItems = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Create Quiz', icon: FileQuestion, href: '/create-quiz' },
  { name: 'Upload Quiz', icon: Upload, href: '/upload-quiz' },
  { name: 'Teacher Profile', icon: UserCircle, href: '/profile' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

// Types
interface User {
  name: string
  email: string
  image?: string
}

interface SidebarProps {
  user: User | null
  expanded?: boolean
  onExpand?: () => void
  onLogout: () => void
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setExpanded(window.innerWidth >= 1024)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-primary/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-primary rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-lg shadow-lg rounded-full"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-r shadow-2xl">
            <MobileSidebar user={user} onLogout={logout} />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={cn(
            "fixed top-0 left-0 h-screen bg-card shadow-xl transition-all duration-300 ease-in-out border-r",
            expanded ? "w-60" : "w-20"
          )}
        >
          <DesktopSidebar
            user={user}
            expanded={expanded}
            onExpand={() => setExpanded(!expanded)}
            onLogout={logout}
          />
        </aside>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out bg-background/50",
          isMobile ? "ml-0" : expanded ? "ml-60" : "ml-20"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl container mx-auto px-4 h-14 border-b">
          <div className="flex items-center justify-end h-full">
            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="w-[300px] pl-9 bg-background/50 backdrop-blur-lg border-muted"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative hover:bg-background/80">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

// Desktop Sidebar Component
function DesktopSidebar({ user, expanded, onExpand, onLogout }: SidebarProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 flex justify-between items-center">
        <Link href="/dashboard" className={cn(
          "flex items-center gap-3 transition-all",
          expanded ? "justify-start" : "justify-center"
        )}>
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/90 to-blue-500/80 shadow-lg transform hover:scale-105 transition-all"></div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500/70 to-cyan-400/70 shadow-inner flex items-center justify-center">
              <Brain className="h-6 w-6 text-white/90 drop-shadow-md" />
            </div>
          </div>
          {expanded && (
            <span className="font-bold text-xl">
              Neuro Crack
            </span>
          )}
        </Link>
      </div>

      <div className="px-4">
        <Separator className="mb-2" />
      </div>

      <nav className="flex-1 px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all",
              "hover:bg-primary/10 hover:text-primary",
              pathname === item.href && "bg-primary/10 text-primary",
              expanded ? "justify-start" : "justify-center"
            )}
          >
            <item.icon className="h-5 w-5" />
            {expanded && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all",
            "text-black hover:bg-red-500/20",
            expanded ? "justify-start" : "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {expanded && <span>Logout</span>}
        </button>
      </div>

      <div className="px-4">
        <Separator className="mt-6" />
      </div>

      <div className={cn("px-4 py-2 border-gray-200", expanded ? "w-full" : "w-20")}>
        <div className={cn("flex items-center", expanded ? "justify-between" : "justify-center")}>
          <div className={cn("flex items-center", expanded ? "gap-3" : "")}>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="https://picsum.photos/200/300" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.[0]?.toUpperCase() || "MR"}
              </AvatarFallback>
            </Avatar>
            {expanded && (
              <div className="flex-1 max-w-[160px]">
                <p className="font-medium text-base truncate">Rakibur Rahman</p>
                <p className="text-xs text-muted-foreground truncate">rakiburrahman780@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile Sidebar Component
function MobileSidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse"></div>
            <BookOpen className="h-10 w-10 text-primary relative z-10" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Neuro Crack
          </span>
        </Link>
      </div>

      <Separator className="mb-6" />

      <nav className="flex-1 px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all",
              "hover:bg-primary/10 hover:text-primary",
              pathname === item.href && "bg-primary/10 text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <Separator className="mt-6" />

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
} 