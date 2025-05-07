'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { AppConstants } from '@/lib/utils/app-constants'
import { Search, BookOpen, Clock, Star, ChevronRight, ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// Mock data for development
const categories = [
  { id: 1, name: 'Development', icon: '💻', count: '1,200 courses' },
  { id: 2, name: 'Business', icon: '📊', count: '890 courses' },
  { id: 3, name: 'Design', icon: '🎨', count: '750 courses' },
  { id: 4, name: 'Marketing', icon: '📱', count: '430 courses' },
  { id: 5, name: 'IT & Software', icon: '🖥️', count: '620 courses' },
  { id: 6, name: 'Personal Development', icon: '🎯', count: '340 courses' },
]

const courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    rating: 4.8,
    reviews: 12430,
    duration: '63h',
    level: 'Beginner',
    price: '৳1,200',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
  },
  {
    id: 2,
    title: 'Advanced React & NextJS Development',
    instructor: 'Maximilian Schwarzmüller',
    rating: 4.9,
    reviews: 8320,
    duration: '45h',
    level: 'Advanced',
    price: '৳1,500',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80',
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    instructor: 'Sarah Williams',
    rating: 4.7,
    reviews: 5430,
    duration: '38h',
    level: 'Intermediate',
    price: '৳1,100',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80',
  },
]

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Software Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    text: 'The courses here transformed my career. I went from knowing nothing about coding to landing my dream job.',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    role: 'UX Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    text: 'The quality of instruction and course materials is exceptional. Worth every penny!',
  },
]

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    redirect(AppConstants.routes.login)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">{AppConstants.app.name}</span>
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/courses" className="text-sm font-medium hover:text-primary">Courses</Link>
                <Link href="/categories" className="text-sm font-medium hover:text-primary">Categories</Link>
                <Link href="/teach" className="text-sm font-medium hover:text-primary">Teach</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for anything..."
                  className="w-[300px] pl-9"
                />
              </div>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-muted py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn anything, anytime, anywhere
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join millions of learners worldwide in mastering new skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="What do you want to learn?"
                  className="w-full pl-10 h-12"
                />
              </div>
              <Button size="lg">
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <h2 className="text-2xl font-bold mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-card hover:bg-accent rounded-lg p-4 text-center cursor-pointer transition-colors"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <h2 className="text-2xl font-bold mb-8">Featured Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-card rounded-lg overflow-hidden shadow-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{course.instructor}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="ml-1 font-medium">{course.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({course.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="font-bold text-lg">{course.price}</span>
                    <Button>Enroll Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become Instructor CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Become an Instructor</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Share your knowledge with millions of students worldwide. Create your course today.
            </p>
            <Button size="lg" variant="secondary">
              Start Teaching Today
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <h2 className="text-2xl font-bold mb-8 text-center">What Our Students Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-25">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-sm text-muted-foreground hover:text-primary">Help Center</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/cookie" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link href="/teach" className="text-sm text-muted-foreground hover:text-primary">Teach on {AppConstants.app.name}</Link></li>
                <li><Link href="/affiliate" className="text-sm text-muted-foreground hover:text-primary">Affiliate Program</Link></li>
                <li><Link href="/partners" className="text-sm text-muted-foreground hover:text-primary">Partners</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {AppConstants.app.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
