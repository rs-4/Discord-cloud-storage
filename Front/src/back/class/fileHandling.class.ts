import fs from "fs";
import socketIo from "socket.io";

//dts import
import uploadedFileInfo from "../dts/uploadedFileInfo";

//Model import
import FileInfo, { FileInfoDocument } from "../mongo/models/fileInfo.model";

//Class import
import discordService from "./discordService.class";
import uploadFileService from "./uploadFile.class";
import downloadFileService from "./downloadFile.class";

class FileHandlingClass {
    private discordService: discordService;
    private uploadFileService: uploadFileService;
    private downloadFileService: downloadFileService;


    constructor(DiscordToken: string) {
        this.discordService = new discordService(DiscordToken);
        this.uploadFileService = new uploadFileService();
        this.downloadFileService = new downloadFileService();
    }

    public async uploadFileFromBuffer(buffer: Buffer, fileName: string, uploadToken: string, io?: socketIo.Server): Promise<uploadedFileInfo> {

        const BufferArray = this.uploadFileService.fileSlicer(buffer);
        const files = this.uploadFileService.fileBuilder(BufferArray, this.uploadFileService.fileName(fileName));
        const uploadInfo = await this.discordService.attachementRequest(files);

        for (let i = 0; i < uploadInfo.length; i++) {
            await this.discordService.fileUploadRequest(uploadInfo[i].url, BufferArray[i]);
            if (uploadToken) {
                const progress = Math.floor((i + 1) / BufferArray.length * 100);
                io?.to(uploadToken).emit('progress', progress);
            }
        }
        const data = await this.discordService.retrieveFileUrl(uploadInfo);

        const uploadedFileInfo: uploadedFileInfo = {
            filename: this.uploadFileService.fileName(fileName),
            part: BufferArray.length,
            size: buffer.length,
            files: data
        }

        return uploadedFileInfo;

    }

    public async uploadFileFromPath(path: string): Promise<uploadedFileInfo> {
        const buffer = fs.readFileSync(path);
        const BufferArray = this.uploadFileService.fileSlicer(buffer);
        const files = this.uploadFileService.fileBuilder(BufferArray, this.uploadFileService.fileName(path));
        const uploadInfo = await this.discordService.attachementRequest(files);

        for (let i = 0; i < uploadInfo.length; i++) {
            await this.discordService.fileUploadRequest(uploadInfo[i].url, BufferArray[i]);
        }
        const data = await this.discordService.retrieveFileUrl(uploadInfo);

        const uploadedFileInfo: uploadedFileInfo = {
            filename: this.uploadFileService.fileName(path),
            part: BufferArray.length,
            size: buffer.length,
            files: data
        }

        return uploadedFileInfo;

    }

    public async retrieveFileById(id: string, downloadToken?: string, io?: socketIo.Server): Promise<{ buffer: Buffer, filename: string } | null> {
        const fileDocument: FileInfoDocument | null = await FileInfo.findById(id);
        if (!fileDocument)
            return null;
        const buffer = await this.downloadFileService.downloadFile(fileDocument, downloadToken, io);

        return {
            buffer: buffer,
            filename: fileDocument.filename
        };
    }

    public async retrieveFileByName(name: string, downloadToken?: string, io?: socketIo.Server): Promise<{ buffer: Buffer, filename: string } | null> {
        const fileDocument: FileInfoDocument | null = await FileInfo.findOne({ filename: name });
        if (!fileDocument)
            return null;
        const buffer = await this.downloadFileService.downloadFile(fileDocument, downloadToken, io);

        return {
            buffer: buffer,
            filename: fileDocument.filename
        };
    }

}

export default FileHandlingClass;