import File from "../dts/file";

class uploadFileService {

  private readonly MAX_FILE_SIZE = 26214400;

  fileSlicer(buffer: Buffer): Buffer[] {
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

  fileBuilder(files: Buffer[], filename: string): File[] {
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

  fileName(path: string): string {
    let splitPath = path.split("/");
    return splitPath[splitPath.length - 1];
  }

}

export default uploadFileService;