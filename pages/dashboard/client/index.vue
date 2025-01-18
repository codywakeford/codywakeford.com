<template>
    <mpage class="admin-mpage">
        <dashboard-project-list interface="client" />
    </mpage>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    // middleware: "admin-auth",
})
</script>

<style scoped lang="scss"></style>
