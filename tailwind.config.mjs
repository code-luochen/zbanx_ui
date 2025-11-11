const purgeEnabled = process.env.NODE_ENV === "production";

export default {
  purge: {
    enabled: purgeEnabled,
    content: [
      "./src/components/**/*.html",
      "./src/components/**/*.tsx",
      "./src/components/**/*.jsx",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
