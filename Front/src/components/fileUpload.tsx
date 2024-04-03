"use client";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Button, Progress } from "@nextui-org/react";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";


interface FileUploaderProps {
  acceptedFileTypes?: string[] | null;
  url: string;
  maxFileSize?: number;
  allowMultiple?: boolean;
  label?: string;
  labelAlt?: string;
}

export default function FileUploader(props: FileUploaderProps) {
  const {
    acceptedFileTypes,
    url,
    maxFileSize = 5,
    allowMultiple = false,
    label = "",
    labelAlt = "",
  } = props;

  const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // MB to bytes

  // Change the state structure to handle multiple file progress and status

  const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileInfo, setFileInfo] = useState<File | null>(null);
  const [uploadToken, setUploadToken] = useState<string | null>(null);

  const isError = Object.values(fileStatus).some(
    (status) => status !== "Uploaded"
  );

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploader = () => {
    setFileStatus({});
    setUploadError(null);
    setUploadSuccess(false);
    setUploadToken(null);
    setProgress(0);
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const file = files[0];
      setFileInfo(file);

    }
  };

  useEffect(() => {
    if (fileInfo !== null) {
      const retrieveDownloadInfo = async () => {
        try {
          const response = await fetch(
            `/api/file/upload`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          const data = await response.json();
          setUploadToken(data.uploadToken);
        } catch (error: any) {
          console.error("Error downloading file:", error.message);
        }
      };

      retrieveDownloadInfo();
    }
  }, [fileInfo]);

  useEffect(() => {
    const fileUploadHandler = async (file: File) => {
      const updatedUrl = `${url}?filename=${file.name.split('?')[0]}&uploadToken=${uploadToken}`;

      fetch(updatedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: file,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `An error occurred while uploading the file. Server response: ${response.statusText}`
            );
          }
          return response.text(); // Adjust if server response is not plain text
        })
        .then(() => {
          setFileStatus((prev) => ({ ...prev, [file.name]: "Uploaded" }));
          setUploadSuccess(true);
          toast.success("File uploaded successfully!");
        })
        .catch((error) => {
          setFileStatus((prev) => ({
            ...prev,
            [file.name]: `An error occurred while uploading the file. ${error.message}`,
          }));
        });
    };

    if (fileInfo && uploadToken) {
      const socket = io(`http://localhost:8080?room=${uploadToken}`);

      socket.on("connect", async () => {
        await fileUploadHandler(fileInfo);
      });

      socket.on("progress", (progress: number) => {
        setProgress(progress);
      });

      return () => {
        setProgress(0);
        socket.disconnect();
      };
    }
  }, [uploadToken]);

  return (
    <div className="">
    <div className="">
      {uploadSuccess ? (
        <div className="">
          {isError ? (
            <span className="text-xs text-red-500">
              Upload completed, but with errors.
            </span>
          ) : (
            <></>
          )}
          <div className="btn-group w-full">
            <span className="btn btn-success w-1/2">Success!</span>
            <Button  onPress={resetUploader}>
              Upload Another
            </Button>
          </div>
        </div>
      ) : (
        <div className="form-control w-full">
          <Label className="label">
            <span className="label-text">{label}</span>
            <span className="label-text-alt">{labelAlt}</span>
          </Label>
          {uploadToken === null ? (
            <Input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full cursor-pointer"
              onChange={fileSelectedHandler}
              accept={
                acceptedFileTypes ? acceptedFileTypes.join(",") : undefined
              }
              ref={fileInputRef}
              multiple={false}
            />
          ) : null}
          <Label className="label text-center">
            <span className="label-text-alt text-red-500">{uploadError}</span>
          </Label>
        </div>
      )}

      <div className="overflow-x-auto flex gap-2 flex-col-reverse">
        {fileInfo && uploadSuccess === false && (
          <div key={fileInfo.name} className="text-xs flex flex-col gap-1">
            <p>{fileInfo.name}</p>

            <Progress
              size="sm"
              value={progress}
              showValueLabel={true}
              aria-label="Uploading..."
              className="max-w-md"
            />

            <p className="text-red-500">
              {fileStatus[fileInfo.name] !== "Uploaded"
                ? fileStatus[fileInfo.name]
                : ""}
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
