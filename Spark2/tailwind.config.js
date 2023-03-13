module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    theme: {
        extend: {},
        fontFamily: {
            mono: ['\"Fira Code\"','\"Fira Code VF\"', 'monospace'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
