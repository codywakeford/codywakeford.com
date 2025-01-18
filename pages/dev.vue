<template>
    <main>
        <pre>
            {{ user }}
        </pre>
    </main>
</template>

<script setup lang="ts">
const user = computed(() => {
    return $User.get || {}
})
</script>

<style lang="scss" scoped>
main {
    height: 500px;
    padding: 200px;
}
</style>
