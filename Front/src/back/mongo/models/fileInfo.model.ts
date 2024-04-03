import mongoose from "mongoose";
import fileDiscordInfo from "../../dts/fileInfo";

export interface FileInfoDocument {
  filename: string;
  part: number;
  size: number;
  files: fileDiscordInfo[];
}

const FileInfoSchema = new mongoose.Schema({
  filename: {type: String, required: true, unique: true},
  part: { type: Number, required: true },
  size: { type: Number, required: true },
  files: [
    {
      filename: String,
      url: String
    }
  ]

});

const FileInfo = mongoose.models.FileInfo || mongoose.model<FileInfoDocument>('FileInfo', FileInfoSchema);
export default FileInfo;