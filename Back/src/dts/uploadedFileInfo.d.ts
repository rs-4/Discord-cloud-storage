import fileInfo from "./fileInfo";

interface uploadedFileInfo {
  filename: string;
  part: number;
  size: number;
  files: fileInfo[];
}

export default uploadedFileInfo;