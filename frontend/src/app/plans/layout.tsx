"use client";

import { CartProvider } from "./context/CartContext";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
