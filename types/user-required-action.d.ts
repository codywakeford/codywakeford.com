export {}

declare global {
    interface Action {
        id: string
        projectId: string

        timestamp: number
        completedTimestamp?: number

        priority: number
        description: string
        status: ActionStatus
        action: Actiontype
    }

    type ActionType = "payment" | "aporove-design" | "book-meeting" | "respond-to-proposal" | "upload-document"

    type ActionStatus = "pending" | "completed" | "cancelled"
}
