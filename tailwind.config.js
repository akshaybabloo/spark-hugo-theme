/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./layouts/**/*.{html,js}"],
    theme: {
        extend: {
            spacing: {
                '4.5': '1.125rem',
            },
            colors: {
                'dark-void': '#151419',
                'liquid-lava': '#f56e0f',
                'dusty-grey': '#878787',
                'gluon-grey': '#1b1b1e',
                'slate-grey': '#262626',
                'snow': '#fbfbfb',
                'gray': {
                    500: '#878787',
                    600: '#262626',
                    800: '#1b1b1e',
                    900: '#151419',
                },
                'white': '#fbfbfb',
            },
        },
        fontFamily: {
            mono: ['\"Fira Code\"', '\"Fira Code VF\"', 'monospace'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
