import axios from "axios";
import UploadInfo from "../dts/uploadInfo";
import fileDiscordInfo from "../dts/fileInfo";
import File from "../dts/file";

class discordService {

  private DiscordToken: string;

  constructor(DiscordToken: string) {
    this.DiscordToken = DiscordToken;
  }

  async attachementRequest(files: File[]): Promise<UploadInfo[]> {

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

  async fileUploadRequest(url: string, files: Buffer): Promise<void> {
    await axios({
      method: "put",
      url: url,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      data: files
    })
  }

  async retrieveFileUrl(uploadInfo: UploadInfo[]): Promise<fileDiscordInfo[]> {

    const fileDiscordInfo: fileDiscordInfo[] = [];
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
        fileDiscordInfo.push({
          filename: attachmentsData[i].filename,
          url: attachmentsData[i].url
        })
      }
      i++;
    }

    return fileDiscordInfo;
  }
}

export default discordService