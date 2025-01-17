// import { useUserStore } from "~/stores/user"
// import { useProjectStore } from "../stores/projects"
// import { useChatroomStore } from "../stores/chatroom"
// import { useNotificationStore } from "../stores/notifications"

export type ProjectStore = ReturnType<typeof useProjectStore>
export type UserStore = ReturnType<typeof useUserStore>
export type ChatroomStore = ReturnType<typeof useChatroomStore>
export type NotificationStore = ReturnType<typeof useNotificationStore>
export type FileStore = ReturnType<typeof useFileStore>

let $User: UserStore
let $Chatroom: ChatroomStore
let $Projects: ProjectStore
let $Notifications: NotificationStore
let $Files: FileStore

export async function initPiniaStores() {
    $User = useUserStore()
    $User.init()

    $Chatroom = useChatroomStore()
    $Chatroom.init()

    $Projects = useProjectStore()
    $Projects.init()

    $Notifications = useNotificationStore()
    $Notifications.init()

    $Files = useFileStore()
    $Files.init()
}

export { $User, $Projects, $Chatroom, $Notifications, $Files }
