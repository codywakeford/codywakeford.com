export {}

declare global {
    // An activity item can have an action button attatched
    type ActionButton = LinkButton | MeetingButton | OpenDesignButton

    interface OpenDesignButton {
        type: "open-design"
    }

    interface BaseActivityItem {
        id: string
        type: string
        timestamp: number
        actions: Action["id"][]
        sender: User["email"] | "system"
    }

    interface ActionActivityItem extends BaseActivityItem {
        type: "action"
    }

    interface AttachmentActivityItem extends BaseActivityItem {
        type: "attachment"
        files: ProjectFile["id"][]
    }

    interface MessageActivityItem extends BaseActivityItem {
        type: "activity-message"
        message: string
    }

    interface PhaseActivityItem extends BaseActivityItem {
        type: "phase"
        phaseTo: ProjectPhase
    }

    interface QuoteActivityItem extends BaseActivityItem {
        type: "quote"
        projectId: Project["id"]
    }

    interface SystemMessageActivityItem extends BaseActivityItem {
        type: "system-message"
        message: string
        sender: "system"
    }

    interface MeetingActivityItem extends BaseActivityItem {
        type: "meeting"
        meetingId: string
    }

    type ActivityItem =
        | ActionActivityItem
        | AttachmentActivityItem
        | MessageActivityItem
        | PhaseActivityItem
        | QuoteActivityItem
        | MeetingActivityItem
        | SystemMessageActivityItem

    interface ActivityLog {
        projectId: string
        activity: ActivityItem[]
    }
}
