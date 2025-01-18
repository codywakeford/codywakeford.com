<template>
    <section class="chatroom-container">
        <div class="messages-container" ref="messagesContainer">
            <!-- TODO: ui -->
            <pre>docs: {{ $Chatroom.getChatroomDocuments(projectId) }}</pre>
            <pre>images: {{ $Chatroom.getChatroomImages(projectId) }}</pre>

            <div v-if="loading" class="loading-state">
                <p>Loading messages...</p>
            </div>

            <div v-else-if="messages.length" class="messages">
                <div
                    v-for="msg in messages"
                    :key="msg.id"
                    class="message"
                    :class="{
                        'own-message':
                            msg.sender === $CurrentUser.displayName ||
                            msg.sender === $CurrentUser.email,
                        // loading: msg.loading,
                        // error: msg.error,
                    }"
                >
                    <div class="message-content">
                        <strong>{{ msg.sender }}:</strong>
                        <span v-if="msg.message">{{ msg.message }}</span>
                        <!-- <a v-if="msg.fileUrl" :href="msg.fileUrl" target="_blank" class="file-link">
                            📎 {{ msg.fileName }}
                        </a> -->
                    </div>
                    <!-- <div v-if="msg.loading" class="message-status">Sending...</div>
                    <div v-else-if="msg.error" class="message-status error">
                        Failed to send. Tap to retry.
                    </div> -->
                </div>
            </div>
            <div v-else class="empty-state">
                <p>No messages yet. Start the conversation!</p>
            </div>
        </div>

        <div class="input-container">
            <div class="message-form">
                <div class="input-wrapper">
                    <input
                        v-model="message"
                        type="text"
                        placeholder="Type a message..."
                        class="message-input"
                        :disabled="sending"
                        @keyup.enter="sendMessage"
                    />
                    <label class="file-input-label">
                        <input
                            type="file"
                            @change="handleFileSelect"
                            class="file-input"
                            :disabled="sending"
                        />
                        <span class="file-button">📎</span>
                    </label>
                </div>
                <button type="button" class="send-button" :disabled="sending" @click="sendMessage">
                    {{ sending ? "Sending..." : "Send" }}
                </button>
            </div>
        </div>
    </section>
    {{ $Chatroom.get }}
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage"

const route = useRoute()
const projectId = route.params.id as string

const fileInput = ref<File | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

const loading = ref(false)
const sending = ref(false)

const messages = computed(() => $Chatroom.getChatroomMessages(projectId))
const message = ref("")
const messageObj = computed(() => {
    return {
        message: message.value,
        sender: $User.email,
    }
})

watch(fileInput, (newValue) => {
    if (newValue) {
        sendDocument()
    }
})

watch(messages, (newValue) => {
    scrollToBottom()
})

function sendMessage() {
    if (messageObj.value.message === "") return
    $Chatroom.sendMessage(projectId, messageObj.value)
    message.value = ""
}

function scrollToBottom() {
    setTimeout(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    }, 10)
}

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        fileInput.value = input.files[0]
    }
}

async function sendDocument() {
    console.log("here")
    if (!fileInput.value) return
    const file = fileInput.value
    console.log("here")
    const $storage = useStorage()
    const fileStorageRef = storageRef($storage, `${projectId}/files/${file.name}`)

    const userRef = $CurrentUser.reference
    let fileType: ChatroomDocument["type"] = "document"

    if (file.type.startsWith("image/")) {
        fileType = "image"
    } else {
        fileType = "document"
    }
    const message: Omit<Message, "id" | "timestamp"> = {
        message: `${userRef} has uploaded a document.`,
        sender: userRef,
    }

    try {
        await uploadBytes(fileStorageRef, fileInput.value)
        const url = await getDownloadURL(fileStorageRef)

        const document = {
            url: url,
            name: file.name,
            type: fileType,
        } as ChatroomDocument

        $Chatroom.sendDocument(projectId, document)

        await $Chatroom.sendMessage(projectId, message)
    } catch (error) {
        console.error("Error uploading document:", error)
        throw error
    }
}
onMounted(() => {
    scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chatroom-container {
    position: relative;
    z-index: 10;
    display: flex;
    width: 70rem;
    flex-direction: column;
    height: 100%;
    min-height: 400px;
    max-height: calc(100vh - 200px);
    background: #ffffff;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    scroll-behavior: smooth;
}

.messages {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.message {
    max-width: 80%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    background: #f3f4f6;
    word-break: break-word;

    &.own-message {
        align-self: flex-end;
        background: #e0f2fe;

        strong {
            color: #0369a1;
        }
    }

    &.loading {
        opacity: 0.7;
    }

    &.error {
        border: 1px solid #ef4444;
    }

    strong {
        color: #4b5563;
        margin-right: 0.5rem;
    }
}

.message-status {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    color: #6b7280;

    &.error {
        color: #ef4444;
    }
}

.input-container {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
}

.message-form {
    display: flex;
    gap: 0.5rem;
}

.input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
}

.message-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    padding: 0.5rem;

    &:focus {
        outline: none;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.file-input-label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.file-input {
    display: none;
}

.file-button {
    font-size: 1.25rem;
    padding: 0.25rem;
}

.send-button {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: #2563eb;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.file-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: #3b82f6;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

.empty-state,
.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #9ca3af;
    font-style: italic;
}
</style>
