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
        getChatroomDocuments: (state) => (chatroomId: string) => {
            const chatroom = state.chatrooms.find((chatroom) => {
                return chatroom.projectId === chatroomId
            })

            return (
                chatroom?.documents.filter((document) => {
                    return document.type === "document"
                }) || []
            )
        },

        getChatroomImages: (state) => (chatroomId: string) => {
            const chatroom = state.chatrooms.find((chatroom) => {
                return chatroom.projectId === chatroomId
            })

            return (
                chatroom?.documents.filter((document) => {
                    return document.type === "image"
                }) || []
            )
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
                const documentsRef = collection(doc($db, "projects", projectId), "documents")

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

                onSnapshot(documentsRef, (snapshot) => {
                    const documents = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as ChatroomDocument[]

                    const chatroom = this.chatrooms.find(
                        (chatroom) => chatroom.projectId === projectId
                    )

                    if (chatroom) {
                        chatroom.documents = documents
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
                    documents: [] as ChatroomDocument[],
                } as Chatroom

                const messages = await this.readChatroomMessages(id)
                const documents = await this.readChatroomDocuments(id)
                chatroom.messages = messages
                chatroom.documents = documents

                chatrooms.push(chatroom)
            }
            this.chatrooms = chatrooms
        },

        async readChatroomMessages(projectId: string) {
            const { data } = await useFetch<Message[]>(`/api/chatrooms/messages/${projectId}`)
            return data.value || []
        },

        async readChatroomDocuments(projectId: string) {
            console.log("reading docs")
            const { data } = await useFetch<ChatroomDocument[]>(
                `/api/chatrooms/documents/${projectId}`
            )
            console.log(data.value)
            return data.value || []
        },

        async sendMessage(projectId: string, message: Omit<Message, "id" | "timestamp">) {
            console.log("righty here")
            console.log(message)
            await useFetch("/api/chatrooms/message", {
                method: "POST",
                body: {
                    id: projectId,
                    message: message,
                },
            })
        },

        async sendDocument(projectId: string, document: Omit<ChatroomDocument, "id">) {
            await useFetch("/api/chatrooms/documents", {
                method: "POST",
                body: {
                    id: projectId,
                    document: document,
                },
            })
        },
    },
})
