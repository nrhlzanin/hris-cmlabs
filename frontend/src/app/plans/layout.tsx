"use client";

import { CartProvider } from "./context/CartContext";
import { PlansProvider } from "@/contexts/PlansContext";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlansProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </PlansProvider>
  );
}
