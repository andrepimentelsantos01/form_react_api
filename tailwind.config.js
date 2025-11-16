/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: "class", // habilita tema escuro via classe 'dark'
    theme: {
        extend: {
            colors: {
                "corp-dark": "#071022",
                "corp-card": "#071827",
                "corp-sidebar": "#08151f",
            },
            transitionProperty: {
                "form-map": "margin, width, transform, opacity",
            },
            translate: {
                "map-shift": "-10%",
            },
            scale: {
                "98": "0.98",
            },
            animation: {
                "fade-slide": "fadeSlide 0.5s ease-in-out forwards",
            },
            keyframes: {
                fadeSlide: {
                    "0%": { opacity: 0, transform: "translateY(10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
