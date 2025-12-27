"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/lib/types/auth-types"
import { getRequest } from "@/lib/api/api-caller"
import { toast } from "sonner"
import { useAuth } from "@/lib/hooks/use-auth"
import { CreateUserDialog } from "./create-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import { ResetPasswordDialog } from "./reset-password-dialog" // Import the new dialog

export default function ProfilePage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (user?.role !== 'admin') {
      if(user) { // only show toast if user is loaded
        toast.error("You are not authorized to view this page.");
      }
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true)
      const res = await getRequest<{ data: User[] }>("/api/user")
      setUsers(res.data)
    } catch (error) {
      toast.error("Failed to fetch users.")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (user?.role !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-semibold text-gray-700">Unauthorized</p>
            <p className="text-gray-500">You do not have permission to access this page.</p>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users Profile</h1>
        <CreateUserDialog onUserCreated={fetchUsers} />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex space-x-2"> {/* Added flex and space-x for spacing */}
                  <EditUserDialog user={user} onUserUpdated={fetchUsers} />
                  <ResetPasswordDialog user={user} /> {/* Add Reset Password button */}
                  <DeleteUserDialog user={user} onUserDeleted={fetchUsers} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
