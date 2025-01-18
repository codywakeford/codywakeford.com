<template>
    <nav>
        <div class="logo-box">
            <img src="/assets/cw-logo.webp" alt="" />
        </div>

        <cflex class="links">
            <nuxt-link to="/dashboard/client">
                <Icon
                    icon="material-symbols:design-services-outline-sharp"
                    width="30"
                    color="white"
                />
            </nuxt-link>
            <nuxt-link to="/dashboard/chatroom">
                <!-- <btn> -->
                <Icon icon="material-symbols:android-messages" width="30" color="white" />
                <!-- <tooltip right>Messaging</tooltip> -->
                <!-- </btn> -->
            </nuxt-link>

            <nuxt-link to="/dashboard/client/documents">
                <Icon icon="material-symbols-light:docs-outline" width="30" color="white" />
            </nuxt-link>

            <nuxt-link to="/dashboard/client/billing">
                <Icon icon="material-symbols-light:credit-card-outline" width="30" color="white" />
            </nuxt-link>
        </cflex>

        <cflex class="bottom-links">
            <nuxt-link to="/dashboard/staff">
                <Icon
                    icon="material-symbols:design-services-outline-sharp"
                    width="30"
                    color="white"
                />
            </nuxt-link>
            <nuxt-link to="/#hero">
                <Icon icon="material-symbols:arrow-back" width="30" color="white" />
            </nuxt-link>
        </cflex>
    </nav>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
</script>

<style lang="scss" scoped>
nav {
    width: 75px;
    background: $primary;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding-block: 25px;
    z-index: 5;
}

.links {
    gap: 25px;
}

.bottom-links {
    margin-top: auto;
}

.logo-box {
    img {
        width: 50px;
    }
}
</style>
