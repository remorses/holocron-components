/** @type {import('tailwindcss').Config} */
module.exports = {
    // nextui is only used for extensions so it's not needed here
    content: [
        './src/**/*.{ts,tsx,css,html,js}', //
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    corePlugins: {
        // preflight: false,
    },
    plugins: [],
}
