/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "components/**/*.{tsx,ts}",
    "pages/**/*.{tsx,ts}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        inherit: "inherit",
      },
    },
  },
  plugins: [],
};
