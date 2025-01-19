export default defineNuxtRouteMiddleware((to, from) => {
    if (!$User.email) navigateTo("/auth/login")
})
