"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import io from "socket.io-client";
import DownloadCard from "../../components/downloadCard";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/file");
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
            `http://localhost:8080/api/file/download?id=${download.id}`,
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
            `http://localhost:8080/api/file/download?id=${download.id}&downloadToken=${downloadInfo.downloadToken}`
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

  if (loading) {
    return <Spinner label="Loading..." color="default" />;
  }

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {fileInfo &&
        fileInfo.map((item, index) => (
          <DownloadCard
            key={index}
            item={item}
            download={download}
            setDownloadStarter={setDownloadStarter}
            progress={downloadProgress}
          />
        ))}
    </div>
  );
};

export default Page;
