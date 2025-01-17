// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: false },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/style/variables.scss" as *;',
                },
            },
        },
    },

    extends: [
        ["../nova-components", { install: true }],
        ["../novatek-email", { install: true }],
        ["../novatek-payments", { install: true }],
    ],

    css: ["@/style/main.scss"],
    modules: ["@nuxt/fonts"],
})
