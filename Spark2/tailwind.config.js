module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
