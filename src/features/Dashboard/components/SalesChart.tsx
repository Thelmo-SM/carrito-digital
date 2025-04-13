'use client';

import styles from '@/styles/SalesChart.module.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Ene', ventas: 400 },
  { month: 'Feb', ventas: 300 },
  { month: 'Mar', ventas: 500 },
  { month: 'Abr', ventas: 700 },
  { month: 'May', ventas: 600 },
  { month: 'Jun', ventas: 800 },
];

const SalesChart = () => {
  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.title}>Ventas mensuales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
