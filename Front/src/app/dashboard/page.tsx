'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoData  from "@/components/noData";
import InfoData from "@/src/components/info";
import  Download  from "../download/page";
import Uploader from "../upload/page";
import { useSession } from "next-auth/react";

export interface FileInfo {
  name: string;
  size: number;
  id: string;
}

export default function Page() {

  const { data: session } = useSession();

  const [fileInfo, setFileInfo] = useState<FileInfo[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/file");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data: FileInfo[] = await response.json();
        setFileInfo(data);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  console.log(fileInfo);

  const calculateTotalSize = () => {
    const calcul = ((fileInfo?.reduce((acc, item) => acc + item.size, 0) ?? 0) / 1024 / 1024 / 1024).toFixed(2);

    console.log(calcul);
    return calcul?.toString();
  };

  const sizeMedian = () => {
    const calcul = ((fileInfo?.reduce((acc, item) => acc + item.size, 0) ?? 0) / 1024 / 1024 / 1024).toFixed(2);
    const moyenne = (Number(calcul) / (fileInfo?.length ?? 1)).toFixed(2);
    return moyenne?.toString();
  }

  const restOfStorage = () => {
    const storageMax = 4000;
    const storageUsed = ((fileInfo?.reduce((acc, item) => acc + item.size, 0) ?? 0) / 1024 / 1024 / 1024).toFixed(2);
    const rest = Number(storageMax) - Number(storageUsed) || "";
    return rest?.toString();
  }

  return (
    <ScrollArea className="">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, {session?.user?.name} 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">
          </div>     
        </div> 
        <NoData>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InfoData name="Total Files" data={fileInfo?.length.toString() || ""} symbol="" />
            <InfoData name="Total Size saved" data={calculateTotalSize()} symbol="GB" />
            <InfoData name="Average file size" data={sizeMedian()} symbol="GB" />
            <InfoData name="Rest of Storage" data={restOfStorage()} symbol="GB" />
          </div>
             <Download/>
        </NoData>
      </div>   
  
    </ScrollArea>
  );
}