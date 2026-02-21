export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Karla", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        "marquee-slow": "marquee 24s linear infinite",
      },
    },
  },
  plugins: [],
};
