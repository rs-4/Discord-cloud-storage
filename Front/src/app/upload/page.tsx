import React from 'react';
import FileUploader from "../../components/fileUpload";
import { Upload } from "lucide-react";
import { Label } from '@/components/ui/label';
import NoData from '@/components/noData';


const url = "/api/file/upload";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <div className="border w-full h-full border-b flex flex-col items-center justify-between gap-4 min-h-60  w-full max-w-2xl py-10 px-4 rounded-xl h-fit">
    {children}
  </div>
);

export default function Uploader() {
  return (
    <div className=" flex flex-col text-center ">
    <NoData>
    <main className="flex w-full h-full justify-center content-center pt-16 px-4">
      <Container>
        <h1 className="text-2xl font-bold">File Uploader</h1>
        <Upload size={50} />
        <FileUploader
          url={url}
          maxFileSize={10000}
        />
      </Container>
    </main>
      <h2 className="text-xl pt-4 font-bold text-rose-500 ">Warning !</h2>    
      <Label className="p-4 text-center">You cannot upload files larger than 4GB</Label> 
      </NoData>
    </div>
   
  );
}