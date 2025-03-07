import AuthService from "~~/services/AuthService"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    if (!$User.state.jwt) {
        return navigateTo("/auth/login")
    }

    if (!(await AuthService.validateJwt($User.state.jwt))) {
        return navigateTo("/auth/login")
    }
})
