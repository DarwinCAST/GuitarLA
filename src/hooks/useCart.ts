import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { CartItem, Guitar } from "../types/types";


export const useCart = () => {
  const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");

    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEM = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item : Guitar) {
    const itemExits = cart.findIndex((guitar: Guitar) => item.id === guitar.id);

    if (itemExits >= 0) {
      if (cart[itemExits].quantity >= MAX_ITEMS) return;
      const copyCart = [...cart];
      copyCart[itemExits].quantity++;
      setCart(copyCart);

      console.log(item);
    } else {
      const newItem: CartItem = {...item, quantity: 1}
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    const newCart = cart.filter((guitar) => guitar.id !== id);
    setCart([...newCart]);
  }

  function increaseQuantity(id: Guitar["id"]) {
    const newCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity < MAX_ITEMS) {
        return { ...guitar, quantity: guitar.quantity + 1 };
      }
      return guitar;
    });

    setCart(newCart);
  }

  function decreaseQuantity(id:Guitar["id"]) {
    const newCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity > MIN_ITEM) {
        return { ...guitar, quantity: guitar.quantity - 1 };
      }
      return guitar;
    });

    setCart(newCart);
  }

  function clearCart() {
    setCart([]);
  }

  //State derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  //Sumar todo en el carrito
  const totalCart = useMemo(
    () => cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    [cart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    data,
    isEmpty,
    totalCart
  };
};
