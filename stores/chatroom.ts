import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, Firestore, onSnapshot, orderBy, query } from "firebase/firestore"
import { defineStore } from "pinia"

export const useChatroomStore = defineStore("chatrooms", {
    state: () => ({
        chatrooms: [] as Chatroom[],
    }),

    getters: {
        get(state) {
            return state.chatrooms
        },

        getChatroomMessages: (state) => (chatroomId: string) => {
            const chatroom = state.chatrooms.find((chatroom) => {
                return chatroom.projectId === chatroomId
            })

            return chatroom ? chatroom.messages : []
        },

        getChatroomNames(state) {
            return state.chatrooms.map((chatroom) => {
                return chatroom.projectId
            })
        },
    },

    actions: {
        async init() {
            this.readChatrooms()

            const nuxtApp = useNuxtApp()
            const $db = nuxtApp.$db as Firestore

            const projectsRef = collection($db, "projects")

            const listenToMessagesAndDocuments = (projectId: string) => {
                const messagesRef = collection(doc($db, "projects", projectId), "messages")

                onSnapshot(messagesRef, (snapshot) => {
                    const messages = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Message[]

                    const chatroom = this.chatrooms.find(
                        (chatroom) => chatroom.projectId === projectId
                    )

                    if (chatroom) {
                        chatroom.messages = messages
                    }
                })
            }

            onSnapshot(projectsRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const projectId = change.doc.id
                        listenToMessagesAndDocuments(projectId)
                    }
                })
            })
        },

        async readChatrooms() {
            const { data: idsData } = useFetch("/api/projects/ids")
            const chatroomIds = idsData.value
            if (!chatroomIds) return []

            let chatrooms = [] as Chatroom[]

            for (let id of chatroomIds) {
                let chatroom = {
                    projectId: id,
                    messages: [] as Message[],
                } as Chatroom

                const messages = await this.readChatroomMessages(id)
                chatroom.messages = messages
                chatrooms.push(chatroom)
            }
            this.chatrooms = chatrooms
        },

        async readChatroomMessages(projectId: string) {
            const { data } = await useFetch<Message[]>(`/api/chatrooms/messages/${projectId}`)
            return data.value || []
        },

        async sendMessage(projectId: string, message: Omit<Message, "id" | "timestamp">) {
            console.log(projectId, message)
            await useFetch("/api/chatrooms/message", {
                method: "POST",
                body: {
                    id: projectId,
                    message: message,
                },
            })
        },
    },
})
