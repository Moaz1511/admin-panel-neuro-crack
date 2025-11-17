'use client'

import { TrendingUp, Users, FileQuestion, BarChart, Calendar } from 'lucide-react'
import withAuth from '@/components/shared/withAuth';

// Quick stats data
const quickStats = [
  { title: 'Total Students', value: '2,345', icon: Users, trend: '+12%', color: 'from-blue-600 to-blue-400' },
  { title: 'Active Quizzes', value: '45', icon: FileQuestion, trend: '+5%', color: 'from-purple-600 to-purple-400' },
  { title: 'Completion Rate', value: '87%', icon: TrendingUp, trend: '+8%', color: 'from-green-600 to-green-400' },
  { title: 'Total Revenue', value: '৳12,345', icon: BarChart, trend: '+15%', color: 'from-orange-600 to-orange-400' },
]

function DashboardPage() {
  return (
    <div className="w-full mx-auto px-4 py-4">
      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickStats.map((stat, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, rgb(var(--card)) 0%, rgb(var(--card)) 100%)`,
            }}
          >
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-500">{stat.trend}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-r opacity-10"
              style={{
                background: `linear-gradient(135deg, ${stat.color.split(' ')[1]} 0%, transparent 100%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Quiz Completed</p>
                  <p className="text-sm text-muted-foreground">30 students completed Python Basics Quiz</p>
                </div>
                <span className="ml-auto text-sm text-muted-foreground">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Upcoming Quizzes</h2>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Advanced JavaScript</p>
                  <span className="text-xs text-muted-foreground">Tomorrow</span>
                </div>
                <p className="text-sm text-muted-foreground">25 students enrolled</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 

export default withAuth(DashboardPage); 