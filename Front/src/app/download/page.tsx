"use client";

import React, { useState, useEffect } from "react";
import { Spinner, Tab } from "@nextui-org/react";
import io from "socket.io-client";
import DownloadCard from "../../components/downloadCard";
import { Input } from "../../../components/ui/input";
import { Files, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download } from "lucide-react";
import { toast } from "sonner"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NoData from "@/components/noData";


export interface FileInfo {
  name: string;
  size: number;
  id: string;
}
export interface Download {
  id: string;
  active: boolean;
  name: string;
}

export interface DownloadInfo {
  downloadToken: string;
  fileId: string;
}

const Page = () => {
  const [fileInfo, setFileInfo] = useState<FileInfo[] | null>(null);
  const [download, setDownloadStarter] = useState<Download | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [filteredFiles, setFilteredFiles] = useState<FileInfo[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
 const filteredFilesList = fileInfo?.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  }
  );




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
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (download && fileInfo !== null) {
      const retrieveDownloadInfo = async () => {
        try {
          const response = await fetch(
            `/api/file/download?id=${download.id}`,
            {
              method: "POST",
            }
          );
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          const data: DownloadInfo = await response.json();
          setDownloadInfo(data);
        } catch (error: any) {
          console.error("Error downloading file:", error.message);
        }
      };

      retrieveDownloadInfo();
    }
  }, [download]);

  useEffect(() => {
    if (downloadInfo !== null && download) {

      const downloadFile = async () => {
        try {
          const response = await fetch(
            `/api/file/download?id=${download.id}&downloadToken=${downloadInfo.downloadToken}`
          );
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = download.name;
          a.click();
          window.URL.revokeObjectURL(url);
          setDownloadStarter(null);
        } catch (error: any) {
          console.error("Error downloading file:", error.message);
        }
      };

      const socket = io(`http://localhost:8080?room=${downloadInfo.downloadToken}`);

      socket.on("connect", async () => {
        await downloadFile();
        socket.disconnect();
      });

      socket.on("progress", (progress: number) => {
        setDownloadProgress(progress);
      });

      return () => {
        setDownloadProgress(0);
      };
    }

  }, [downloadInfo]);

  useEffect(() => {
    setFilteredFiles(filteredFilesList as FileInfo[]);
  }, [searchTerm, fileInfo]);


  if(downloadProgress === 100) {
    toast.success('Download Complete');
    setDownloadProgress(0);
  }

 console.log(downloadProgress);
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <NoData>


    <div className="flex space-y-4 p-4 md:px-8 pt-4 flex-col">
<div className="h-10 w-full relative">
  <div className="absolute top-0 left-0 flex items-center pl-3 h-full">
    <Search size={20} />
  </div>
  <Input
    type="text"
    placeholder="Search Document..."
    className="pl-10 pr-3 py-2 text-md w-full b shadow-sm "
    value={searchTerm}
    onChange={handleSearchChange}

  />
</div>
    <div className="w-full flex">
      <Table>
        <TableCaption>Files</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">File Name</TableHead>
            <TableHead className="text-center">File Size (MB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles?.map((file) => (
            <TableRow
              key={file.id}
              onClick={() =>
                setDownloadStarter({ id: file.id, active: true, name: file.name })
              }
              className="cursor-pointer"
            >
              <TableCell className="flex"><Files size={16}/>{file.name}</TableCell>
              <TableCell className="text-center">
                {(file.size / 1000000).toFixed(2)}
              </TableCell>
              <TableCell>
                {download?.id === file.id && downloadProgress > 0 && downloadProgress < 100 ? (
                  <>
                    <div style={{ width: 25, height: 25 }}>
                      <CircularProgressbar
                        value={downloadProgress}
                        styles={buildStyles({
                          textColor: 'green',
                          pathColor: 'green',
                          trailColor: 'slate',
                        })}
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ width: 25, height: 25 }}>-</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> 
    </div>
    </div>    
    </NoData>
  );
};

export default Page;
