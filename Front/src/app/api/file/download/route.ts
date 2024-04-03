import { NextRequest } from "next/server";
import FileInfo from "../../../../back/mongo/models/fileInfo.model";
import mongoConnect from  "@/src/back/mongo/mongoConnection";
import checkFileExist from "@/src/back/middleware/checkFileExist";
import { v4 as uuidv4 } from 'uuid';
import socketIo from 'socket.io';
import FileHandlingClass from "@/src/back/class/fileHandling.class";
import  downloadParse from "@/src/back/middleware/downloadIdParse";
import io from "socket.io-client";

export async function POST(req: Request){
    await mongoConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name");
    let file;

    if (!id) {
        file = await FileInfo.findOne({ filename: name as string });
    } else {
        file = await FileInfo.findById(id as string);
    }
    if (!file){
      return new Response('File not found', { status: 404 })
    }
    const downloadToken = uuidv4();
    const body = JSON.stringify({ downloadToken, fileId: file._id });
    const socketIo = io("http://localhost:8080");
    socketIo.emit(`downloadToken:${downloadToken}`, { downloadToken });

    return new Response(body, { status: 200 })
}

export async function GET(req: Request){
    await mongoConnect();
    const fileClass = new FileHandlingClass(process.env.DISCORD_TOKEN as string)
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name");
    const downloadToken = url.searchParams.get("downloadToken");
    var file: { buffer: Buffer; filename: string; } | null = null

    if (!id) {
        file = await fileClass.retrieveFileByName(name as string, downloadToken as string);
    } else {
        file = await fileClass.retrieveFileById(id as string, downloadToken as string);
    }
    if (!file){
      return new Response('File not found', { status: 404 })
    }
    return new Response(file.buffer, { status: 200, headers: { "Content-Disposition": `attachment; filename=${file.filename}`, 'Content-Type': 'application/octet-stream' } })
}