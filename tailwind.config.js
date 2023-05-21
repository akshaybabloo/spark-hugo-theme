module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    theme: {
        extend: {
            spacing: {
                '4.5': '1.125rem',
        },
    },
        fontFamily: {
            mono: ['\"Fira Code\"','\"Fira Code VF\"', 'monospace'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
