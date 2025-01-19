<template>
    <div
        class="message"
        :class="{
            sent: message.sender === $User.email,
            recieved: message.sender !== $User.email,
        }"
    >
        <div class="bottom">
            <div class="sender">{{ message.sender }}</div>

            <rflex>
                <div class="time">{{ formatTime(message.timestamp) }}</div>
                <Icon icon="hugeicons:tick-double-01" v-if="delivered" />
                <Icon icon="hugeicons:tick-01" v-else />
            </rflex>
        </div>

        <div class="content">
            {{ message.message }}
        </div>
        <div class="files" v-if="files.length">
            <dashboard-file-card
                :delete="false"
                :download="true"
                v-for="(file, index) of files"
                :key="index"
                :file="file"
            />
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

    minutes = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutes} ${ampm}`
}
</script>

<style lang="scss" scoped>
.message {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 0.9rem;
    max-width: 75%;

    padding-block: 15px;
    padding-inline: 15px;
    border-radius: $border-radius;

    .content {
        margin-block: 0 10px;
    }

    .files {
        display: flex;
        gap: 25px;
    }

    .bottom {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 5px;
    }

    &.sent {
        align-items: flex-end;
        margin-left: auto;
        background: $primary-light;
        color: $text-light1;
    }

    &.recieved {
        margin-right: auto;
        background: $secondary;
        text-align: left;
    }

    .sender {
        font-weight: 600;
        font-size: 0.75rem;
        text-align: left;
        margin: 0;
        z-index: 15;

        .bottom {
            margin-right: auto;
        }
    }

    .time {
        font-size: 0.75em;
    }
}
</style>
