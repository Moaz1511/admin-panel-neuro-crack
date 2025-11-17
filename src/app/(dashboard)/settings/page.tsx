'use client'

import { Settings, User, Bell, Lock, Palette, HelpCircle } from 'lucide-react'

const settingsCategories = [
  {
    title: 'Account Settings',
    icon: User,
    description: 'Manage your account information and preferences',
    href: '/settings/account'
  },
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Configure how you receive notifications',
    href: '/settings/notifications'
  },
  {
    title: 'Privacy & Security',
    icon: Lock,
    description: 'Manage your privacy and security settings',
    href: '/settings/privacy'
  },
  {
    title: 'Appearance',
    icon: Palette,
    description: 'Customize the look and feel of your dashboard',
    href: '/settings/appearance'
  },
  {
    title: 'Help & Support',
    icon: HelpCircle,
    description: 'Get help and find answers to common questions',
    href: '/settings/help'
  }
]

import withAuth from '@/components/shared/withAuth';

function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        {settingsCategories.map((category, index) => (
          <div
            key={index}
            className="group p-6 rounded-xl border bg-card hover:bg-card/50 transition-colors cursor-pointer"
            onClick={() => console.log(`Navigate to ${category.href}`)}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <category.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default withAuth(SettingsPage); 