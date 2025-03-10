export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    await $App.appStart()

    console.log($User.jwt)

    if (!$User.jwt) {
        return navigateTo("/auth/login")
    }

    if (!(await $User.validateJwt($User.jwt))) {
        return navigateTo("/auth/login")
    }
})
