import { defineStore } from "pinia"
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage"

export const useFileStore = defineStore("file", {
    state: () => ({
        files: [] as ProjectFile[],
    }),

    getters: {
        get(state) {
            return state.files
        },

        getFileById: (state) => (fileId: string) => {
            const file = state.files.find((file) => file.id === fileId)

            if (file) return file
        },

        getFilesByIds: (state) => (fileIds: string[]) => {
            return state.files.filter((file) => {
                return fileIds.includes(file.id)
            })
        },

        getFilesByProjectId: (state) => (projectId: string) => {
            return state.files.filter((file) => file.projectId === projectId)
        },
    },

    actions: {
        init() {
            this.read()
        },

        async read() {
            try {
                const response = await $fetch<ProjectFile[]>(`/api/files/${$User.email}`, {
                    method: "GET",
                })

                this.files = response
            } catch (error) {
                console.error(error)
            }
        },

        /** Upload a file to firebase storage */
        async uploadToFirebase(path: string, file: File) {
            const $storage = useStorage()

            const fileStorageRef = storageRef($storage, path)

            try {
                await uploadBytes(fileStorageRef, file)
                const url = await getDownloadURL(fileStorageRef)

                return url
            } catch (error) {
                console.error(error)
            }
        },

        /** Adds a file object to firestore */
        async addFileToProject(projectId: string, file: Omit<ProjectFile, "id">) {
            try {
                const fileId = await $fetch<ProjectFile["id"]>(`/api/projects/${projectId}/files`, {
                    method: "POST",
                    body: { file },
                })

                return fileId
            } catch (error) {
                console.error(error)
            }
        },

        /**Uploads files to firebase and adds them to a project */
        async saveFiles(projectId: string, files: File[]) {
            const fileIds: string[] = []

            for (const file of files) {
                let fileType: ProjectFile["type"] = "document"

                if (file.type.startsWith("image/")) {
                    fileType = "image"
                }

                const path = `${projectId}/files/${file.name}`

                const url = await $Files.uploadToFirebase(path, file)

                const document = {
                    url: url,
                    name: file.name,
                    type: fileType,
                    projectId: projectId,
                } as ProjectFile

                const docId = await this.addFileToProject(projectId, document)

                if (!docId) {
                    throw new Error("No doc id")
                }
                fileIds.push(docId)
            }

            return fileIds
        },
    },
})
