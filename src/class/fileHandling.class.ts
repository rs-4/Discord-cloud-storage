import axios from "axios";
import fs from "fs";
import File from "../dts/file";
import UploadInfo from "../dts/uploadInfo";
import Attachment from "../dts/attachment";
import fileInfo from "../dts/fileInfo";


class FileHandlingClass {
    private DiscordToken: string;
    //readonly MAX_FILE_SIZE = 26214400;
    readonly MAX_FILE_SIZE = 2000;

    constructor(DiscordToken: string) {
        this.DiscordToken = DiscordToken;
    }

    private async fileSlicer(buffer: Buffer): Promise<Buffer[]> {
        if (buffer.length <= this.MAX_FILE_SIZE) {
            return [buffer];
        }
        const bufferArray: Buffer[] = [];

        let start = 0;
        let end = this.MAX_FILE_SIZE;
        while (end < buffer.length) {
            bufferArray.push(buffer.slice(start, end));
            start = end;
            end += this.MAX_FILE_SIZE;
        }
        bufferArray.push(buffer.slice(start, buffer.length));

        return bufferArray
    }

    private async attachementRequest(files: File[]): Promise<UploadInfo[]> {

        const uploadInfo: UploadInfo[] = [];
        const loop = Math.ceil(files.length / 10);
        var i = 0;

        while (i < loop) {
            const filesToSend = files.slice(i * 10, i * 10 + 10);
            const resp = await axios({
                method: "post",
                url: `https://discord.com/api/v9/channels/1205682992954220625/attachments`,
                headers: {
                    Authorization: this.DiscordToken,
                    "Content-Type": "application/json"
                },
                data: { files: filesToSend }
            })
            const attachments = resp.data.attachments;
            for (let i = 0; i < attachments.length; i++) {
                uploadInfo.push({
                    id: attachments[i].id,
                    url: attachments[i].upload_url,
                    filename: attachments[i].upload_filename,
                })
            }
            i++;
        }
        return uploadInfo;
    }

    private async fileUploadRequest(url: string, files: Buffer): Promise<void> {
        await axios({
            method: "put",
            url: url,
            headers: {
                "Content-Type": "application/octet-stream"
            },
            data: files
        })
    }

    private async retrieveFileUrl(uploadInfo: UploadInfo[]): Promise<fileInfo[] | null> {

        const fileInfo: fileInfo[] = [];
        var loop = Math.ceil(uploadInfo.length / 10);
        var i = 0;

        const attachmentBuilder = (uploadInfo: UploadInfo[]) => {
            const attachments = [];

            for (let i = 0; i < uploadInfo.length; i++) {
                attachments.push({
                    "id": i,
                    "filename": uploadInfo[i].filename.split("/")[1],
                    "uploaded_filename": uploadInfo[i].filename
                })
            }
            return attachments;
        }

        while (i < loop) {
            const filesToSend = uploadInfo.slice(i * 10, i * 10 + 10);
            const attachments = attachmentBuilder(filesToSend);
            const resp = await axios({
                method: "post",
                url: "https://discord.com/api/v9/channels/1205682992954220625/messages",
                headers: {
                    Authorization: this.DiscordToken,
                    "Content-Type": "application/json"
                },
                data: {
                    "content": "",
                    "channel_id": "1205682992954220625",
                    "type": 0,
                    "sticker_ids": [],
                    "attachments": attachments
                }
            })
            const attachmentsData = resp.data.attachments;
            for (let i = 0; i < attachmentsData.length; i++) {
                fileInfo.push({
                    id: attachmentsData[i].id,
                    filename: attachmentsData[i].filename,
                    size: attachmentsData[i].size,
                    url: attachmentsData[i].url
                })
            }
            i++;
        }

        return fileInfo;
    }

    private fileName(path: string): string {
        let splitPath = path.split("/");
        return splitPath[splitPath.length - 1];
    }

    private fileBuilder(files: Buffer[], filename: string): File[] {
        const fileArray: File[] = [];
        for (let i = 0; i < files.length; i++) {
            let parts = filename.split(".");
            fileArray.push({
                filename: `${parts[0]}_part_${i}.${parts.slice(1).join('.')}`,
                file_size: files[i].length,
                id: i.toString(),
                is_clip: false
            })
        }
        return fileArray;
    }

    public async uploadFile(path: string) {
        const buffer = fs.readFileSync(path);
        const BufferArray = await this.fileSlicer(buffer);
        const files = this.fileBuilder(BufferArray, this.fileName(path));
        const uploadInfo = await this.attachementRequest(files);

        for (let i = 0; i < uploadInfo.length; i++) {
            await this.fileUploadRequest(uploadInfo[i].url, BufferArray[i]);
        }
        const data = await this.retrieveFileUrl(uploadInfo);
        console.log(data);


    }

    public async retrieveFile(id: string) {

    }
}

export default FileHandlingClass;