<template>
    <nav>
        <div class="logo-box">
            <img src="/assets/cw-logo.webp" alt="" />
        </div>

        <cflex class="links">
            <nuxt-link to="/dashboard/client">
                <Icon icon="material-symbols:construction" width="30" color="white" />
            </nuxt-link>
            <nuxt-link to="/dashboard/chatroom">
                <!-- <btn> -->
                <Icon icon="material-symbols:android-messages" width="30" color="white" />
                <!-- <tooltip right>Messaging</tooltip> -->
                <!-- </btn> -->
            </nuxt-link>

            <nuxt-link to="/dashboard/client/documents">
                <Icon icon="ic:baseline-insert-drive-file" width="30" color="white" />
            </nuxt-link>

            <nuxt-link to="/dashboard/client/billing">
                <Icon icon="fluent:wallet-credit-card-16-filled" width="30" color="white" />
            </nuxt-link>
        </cflex>

        <cflex class="bottom-links">
            <nuxt-link @click="$User.logout()">Logout</nuxt-link>
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
    min-width: 75px;
    background: $primary;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding-block: 25px;
    z-index: 5;
}

a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: $border-radius;
}

.links {
    gap: 25px;
}

.bottom-links {
    gap: 25px;
    margin-top: auto;
}

.logo-box {
    img {
        width: 40px;
    }

    // padding-block: 0px 20px;
    // border-bottom: 1px solid $primary-light;
}

.router-link-active {
    background: $primary-light;
}
</style>
