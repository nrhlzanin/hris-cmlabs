// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // Ini sudah mencakup semua folder di app/
    "./src/components/**/*.{js,ts,jsx,tsx}", // kalau kamu punya komponen di luar app
    "./src/pages/**/*.{js,ts,jsx,tsx}",      // opsional kalau pakai pages router
  ],
  theme: {
    extend: {
      // Custom colorss
      colors: {
        darkgray: "#595959",
        rosered: "#BA3C54",
        airgray: "#7CA5BF",
        berkeley: "#1E3A5F",
        dodgerblue: "#2D8EFF",
        milanored: "#C11106",
        yellowsea: "#FFAB00",
        jade: "#257047",
      },
    },
  },
  plugins: [],
};
