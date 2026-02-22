import { defineStore } from "pinia";
import type { Product } from "../app/types/modal";

type CartItem = { product: Product; qty: number };

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    background: "white",
    colorPalette: "#272727",
    colorButtons: "#abf600",
    cart: [] as CartItem[],
  }),

  getters: {
    cartCount: (state) => state.cart.reduce((acc, it) => acc + it.qty, 0),
    cartTotal: (state) =>
      state.cart.reduce((acc, it) => acc + it.qty * it.product.price, 0),
  },

  actions: {
    setBackground(color: "white" | "gray") {
      this.background = color;
    },
    setColorPalette(palette: string) {
      this.colorPalette = palette;
    },
    setColorButtons(palette: string) {
      this.colorButtons = palette;
    },
    addToCart(product: Product, qty = 1) {
      const found = this.cart.find((x) => x.product.id === product.id);
      if (found) found.qty += qty;
      else this.cart.push({ product, qty });
    },

    increment(productId: Product["id"]) {
      const found = this.cart.find((x) => x.product.id === productId);
      if (found) found.qty += 1;
    },

    decrement(productId: Product["id"]) {
      const found = this.cart.find((x) => x.product.id === productId);
      if (!found) return;
      found.qty -= 1;
      if (found.qty <= 0)
        this.cart = this.cart.filter((x) => x.product.id !== productId);
    },

    removeFromCart(productId: Product["id"]) {
      this.cart = this.cart.filter((x) => x.product.id !== productId);
    },

    clearCart() {
      this.cart = [];
    },
  },
  persist: true,
});
