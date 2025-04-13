'use client';

import { useCustomers } from '../hooks/useCustomers';
import styles from '@/styles/CustomersTable.module.css';
import Image from 'next/image';

const CustomersTable = () => {
  const { users, loading, error } = useCustomers();

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>Error al cargar los clientes.</p>;

  return (
    <div className={styles.container}>
      <h2>Clientes registrados</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.cell}>Imagen</th>
            <th className={styles.cell}>Nombre</th>
            <th className={styles.cell}>Correo</th>
            <th className={styles.cell}>Fecha de registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td className={styles.cell}>
                <Image 
                src={user.image || 'No existe imagen'}
                width={200}
                height={200}
                alt={user.name}
                className={styles.avatar}
                />
              </td>
              <td className={styles.cell}>{user.name} {user.lastName}</td>
              <td className={styles.cell}>{user.email}</td>
              <td className={styles.cell}>
                {user.createdAt?.toDate?.().toLocaleDateString() ?? 'Sin fecha'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
