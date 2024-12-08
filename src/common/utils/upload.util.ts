import { v7 as uuidV7 } from "uuid";

const UploadUtils = {
    generateUploadAvatarFileKey: (userId: number, fileType: string) => {
        return `user/${userId}/${uuidV7()}.${fileType.split('/')[1]}`
    }
}

export default UploadUtils;