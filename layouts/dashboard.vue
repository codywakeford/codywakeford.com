<template>
    <div class="pattern-background" />
    <div class="dashboard">
        <dashboard-navigation />
        <div class="nuxt-page">
            <nuxt-page />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100%;
}

.nuxt-page {
    position: relative;
    z-index: 2;
}
</style>
