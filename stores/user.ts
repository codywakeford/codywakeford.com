import { defineStore } from "pinia"
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import type { Auth, User } from "firebase/auth"

export const useUserStore = defineStore("userStore", {
    state: () => ({
        user: {} as User,
        isLoadings: false,
    }),

    getters: {
        get(state) {
            return state.user
        },

        id(state) {
            return state.user?.id ? state.user.id : "No id"
        },

        email(state) {
            return state.user?.email ? state.user.email : "No email"
        },

        role(state) {
            if (!import.meta.client) return "client"
            const domain = window.location.hostname

            if (state.user && state.user.siteAccess) {
                const siteRole = state.user.siteAccess.find((site) => site.domain === domain)

                if (!siteRole) return "client"
                return siteRole.role
            }
        },

        isAdmin(state): boolean {
            const domain = window.location.hostname

            if (!state.user || !state.user.siteAccess) return false

            const siteRole = state.user.siteAccess.find((site) => site.domain === domain)

            if (!siteRole?.role) return false

            if (siteRole.role === "user") return false

            return true
        },

        isLoading(state) {
            return state.isLoadings
        },

        isAuthenticated(state) {
            return !!state.user.uid
        },
    },

    actions: {
        async asyncGet() {
            while (this.isLoading) {
                await new Promise((resolve) => setTimeout(resolve, 5))
            }
            this.writeCache(this.user)
            return this.user
        },

        async init() {
            // this.user = this.readCache()
            // this.logout()
        },

        async signUp(provider: AuthProvider, email: string, password: string) {
            try {
                const user = await signUp(provider, email, password)
            } catch (error) {
                return error
            }
        },

        async signIn(provider: AuthProvider, email: string, password: string) {
            try {
                const user = await signIn(provider, email, password)
                if (user) {
                    this.user = user
                    this.writeCache(user)
                }
            } catch (error) {
                return error
            }
        },

        async readAccess(id: User["id"]): Promise<User["siteAccess"]> {
            const data = await $fetch<User["siteAccess"]>(`/api/users/access`, {
                params: { uid: uid },
            })

            return data || []
        },

        async logout() {
            const $auth = useAuth()
            try {
                await firebaseSignOut($auth)
                this.clearUser()
                navigateTo("/")
                console.debug("[Veloris] User logged out, cache cleared.")
            } catch (error) {
                console.error("Logout failed: ", error)
            }
        },

        writeCache(user: User) {
            if (!import.meta.client) return
            localStorage.setItem("user", JSON.stringify(user))
        },

        readCache() {
            if (!import.meta.client) return
            const cachedUser = localStorage.getItem("user")
            if (cachedUser) {
                try {
                    console.log("User fetched from client localStorage")
                    return JSON.parse(cachedUser)
                } catch (error) {
                    console.error("Failed to parse cached user data:", error)
                    return {} as User
                }
            }
        },

        clearUser() {
            this.user = {} as User
            this.removeCache()
        },

        async removeCache() {
            if (import.meta.client) localStorage.removeItem("user")
        },
    },
})
