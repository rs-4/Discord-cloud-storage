import axios from "axios";
import socketIo from "socket.io";
import { FileInfoDocument } from "../models/fileInfo.model";

class downloadFileService {

  private async downloadParts(url: string): Promise<Buffer> {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "arraybuffer"
    });
    return response.data;
  }

  public async downloadFile(fileInfo: FileInfoDocument, downloadToken?: string, io?: socketIo.Server): Promise<Buffer> {
    let buffer = Buffer.alloc(0);
    var progress = 0;

    for (let i = 0; i < fileInfo.part; i++) {
      const part = await this.downloadParts(fileInfo.files[i].url);
      buffer = Buffer.concat([buffer, part]);
      if (downloadToken) {
        progress = Math.floor(buffer.length / fileInfo.size * 100);
        io?.to(downloadToken).emit('progress', progress);
      }
    }
    return buffer;
  }

}

export default downloadFileService;