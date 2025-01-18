export {}

declare global {
    interface Chatroom {
        projectId: string
        documents: ChatroomDocument[]
        messages: Message[] | []
    }

    interface Message {
        id: string
        message: string
        sender: string
        timestamp: FieldValue
    }

    interface ChatroomDocument {
        id: string
        url: string
        name: string
        timestamp: FieldValue
        type: "document" | "image"
    }
}
