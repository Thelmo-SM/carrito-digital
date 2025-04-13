'use client';

import styles from '@/styles/SummaryCards.module.css';
import { useDashboardSummary } from '../hooks/useDashboardSummary';

const SummaryCards = () => {
  const { summary, loading } = useDashboardSummary();

  if (loading) return <p>Cargando métricas...</p>;

  const cards = [
    { title: 'Productos', value: summary.products, bgColor: '#e0f2fe' },
    { title: 'Ventas', value: summary.sales, bgColor: '#dcfce7' },
    { title: 'Pedidos', value: summary.orders, bgColor: '#fef9c3' },
    { title: 'Clientes', value: summary.clients, bgColor: '#fae8ff' },
  ];

  return (
    <section className={styles.container}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={styles.card}
          style={{ backgroundColor: card.bgColor }}
        >
          <h3>{card.title}</h3>
          <p>{card.value.toLocaleString()}</p>
        </div>
      ))}
    </section>
  );
};

export default SummaryCards;