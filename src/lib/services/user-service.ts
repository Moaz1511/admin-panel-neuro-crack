import { getRequest } from '../api/api-caller';
import { ApiEndpoints } from '../api/api-endpoints';

interface User {
  id: number;
  name: string;
  email: string;
}

export const getAllUsers = async () => {
  try {
    const response = await getRequest<{ data: User[] }>(ApiEndpoints.users.getAll);
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
