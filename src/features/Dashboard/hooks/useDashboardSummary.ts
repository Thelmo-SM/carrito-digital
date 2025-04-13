// hooks/useDashboardSummary.ts
import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/getDashboardSummary';

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState({
    products: 0,
    orders: 0,
    clients: 0,
    sales: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getDashboardSummary();
      setSummary({
        products: data.productsCount,
        orders: data.ordersCount,
        clients: data.usersCount,
        sales: data.totalSales,
      });
      setLoading(false);
    };

    fetchSummary();
  }, []);

  return { summary, loading };
};
