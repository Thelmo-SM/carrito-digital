"use client";

import { useEffect, useState } from "react";
import { orderTypes } from "@/types/ordersTypes";
import { adminOrders } from "../services/adminOrders";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<orderTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await adminOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error al obtener órdenes:", err);
        setError("Ocurrió un error al cargar las órdenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};
