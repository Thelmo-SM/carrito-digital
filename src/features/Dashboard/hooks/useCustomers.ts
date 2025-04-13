import { useEffect, useState } from 'react';
import { clientService } from '../services/clientServices';
import { dataUsersTypes } from '@/types/usersTypes';

export const useCustomers = () => {
  const [users, setUsers] = useState<dataUsersTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await clientService();
        setUsers(data);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
