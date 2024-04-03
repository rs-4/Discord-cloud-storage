import { NextRequest } from "next/server";
import FileInfo from "@/src/back/mongo/models/fileInfo.model";
import mongoConnect from  "@/src/back/mongo/mongoConnection";
import checkFileExist from "@/src/back/middleware/checkFileExist";

export async function GET(req: Request){
    await mongoConnect();
    const data = await FileInfo.find();
    if (!data)
      return new Response('No document found', { status: 404 })

    var ret = [];
    for (let x = 0; x < data.length; x++) {
      ret.push({ id: data[x]._id, name: data[x].filename, size: data[x].size });
    }
    return new Response(JSON.stringify(ret), { status: 200 })

}