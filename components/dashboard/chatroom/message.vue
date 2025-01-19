<template>
    <div
        class="message"
        :class="{
            sent: message.sender === $User.email,
            recieved: message.sender !== $User.email,
        }"
    >
        <div class="files">
            <dashboard-file-card
                :delete="false"
                :download="true"
                v-for="(file, index) of files"
                :key="index"
                :file="file"
            />
        </div>

        <div class="content">
            {{ message.message }}
        </div>

        <div class="bottom">
            <div class="time">{{ formatTime(message.timestamp) }}</div>
            <Icon icon="hugeicons:tick-double-01" v-if="delivered" />
            <Icon icon="hugeicons:tick-01" v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const props = defineProps<{
    message: Message
}>()
const delivered = true
const files = computed(() => {
    return $Files.getFilesByIds(props.message.files)
})
function formatTime(timestampString: string): string {
    const timestamp = new Date(timestampString)
    let hours: number = timestamp.getHours()
    let minutes: number | string = timestamp.getMinutes()
    const ampm: string = hours >= 12 ? "pm" : "am"

    hours = hours % 12
    hours = hours ? hours : 12

    // Add leading zero for minutes if necessary
    minutes = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutes} ${ampm}`
}
</script>

<style lang="scss" scoped>
.message {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 0.9rem;

    padding: 5px 10px;
    border-radius: $border-radius;
    .content {
        margin-left: auto;
    }
    .files {
        display: flex;
    }

    .bottom {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-left: auto;
    }
    &.sent {
        margin-left: auto;
        background: $primary-light;
        color: $text-light1;
    }

    &.recieved {
        margin-right: auto;
        background: $secondary;
    }

    .time {
        font-size: 0.8rem;
    }
}
</style>
