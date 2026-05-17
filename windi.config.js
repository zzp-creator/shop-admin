import { defineConfig } from "windicss/helpers";

export default defineConfig({
    extract: {
        include: ['index.html', 'src/**/*.{vue, html, jsx, tsx}'],
    },

    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                header: {
                    DEFAULT: '#4338ca',
                    dark: '#1f1f1f'
                },
            },
        },
    },

    plugins: [
        require('windicss/plugin/forms'),
        require('windicss/plugin/aspect-ratio'),
    ],
})