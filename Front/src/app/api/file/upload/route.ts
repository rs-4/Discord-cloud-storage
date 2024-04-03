import { NextRequest } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import socketIo from 'socket.io';
import io from "socket.io-client";
import FileHandlingClass from "@/src/back/class/fileHandling.class";
import FileInfo from "@/src/back/mongo/models/fileInfo.model";

export async function GET(req: Request){
    const uploadToken = uuidv4();
}

export async function POST(req: Request){
    const url = new URL(req.url);
    const uploadtoken = url.searchParams.get("uploadToken");
    const name = url.searchParams.get("filename");
    const fileClass = new FileHandlingClass(process.env.DISCORD_TOKEN as string)
    const nfo = await fileClass.uploadFileFromBuffer(await req.json(), name as string, uploadtoken as string)
    const fileInfo = new FileInfo(nfo)
    await fileInfo.save()
    return new Response('File uploaded', { status: 200 })
}