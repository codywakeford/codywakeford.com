<template>
    <div class="file">
        <div class="controls" v-if="props.delete || props.download">
            <Icon
                @click="emits('delete')"
                v-if="props.delete"
                icon="solar:trash-bin-trash-bold"
                color="red"
                width="15"
            />
            <Icon
                v-if="download"
                icon="ic:round-file-download"
                @click="downloadFile(file.url)"
                width="14"
            />
        </div>
        <Icon icon="ic:baseline-insert-drive-file" width="50" v-if="file.type === 'document'" />
        <img :src="file.url" v-else />

        <div class="name" v-if="file.type === 'document'">{{ truncatedName }}</div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const props = defineProps<{
    file: ProjectFile
    delete: boolean
    download: boolean
}>()

const truncatedName = computed(() => {
    if (props.file.name.length < 13) return props.file.name
    return `${props.file.name.slice(0, 13)}...`
})

const emits = defineEmits(["delete"])

function downloadFile(url) {
    fetch(url)
        .then((response) => response.blob()) // Get the file as a blob
        .then((blob) => {
            const link = document.createElement("a") // Create a temporary link element
            link.href = URL.createObjectURL(blob) // Create a URL for the blob
            link.download = url.split("/").pop() // Set the filename (use the file's name from the URL)
            document.body.appendChild(link) // Append the link to the document
            link.click() // Programmatically click the link to start the download
            document.body.removeChild(link) // Remove the link after the click
        })
        .catch((error) => console.error("Download failed:", error)) // Handle any errors
}
</script>

<style lang="scss" scoped>
.file {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 5px;
    border-radius: $border-radius;

    height: 125px;
    width: 125px;
    background: rgba(0, 0, 0, 0.2);

    .name {
        font-size: 0.8rem;
        white-space: nowrap;
    }

    .controls {
        position: absolute;
        display: flex;

        top: -10px;
        gap: 5px;
        right: -5px;
        padding: 5px 10px;
        background: $primary;
        border-radius: $border-radius;
        color: $text-light1;
    }

    img {
        max-width: 100%;
        border-radius: $border-radius;
        max-height: 100%;
    }
}
</style>
