import React from 'react';
import FileUploader from "@/components/fileUpload";

const url = "http://localhost:8080/api/file/upload";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <div className="flex flex-col items-center justify-between gap-4 min-h-60 bg-zinc-800 w-full max-w-2xl py-10 px-4 rounded-xl h-fit">
    {children}
  </div>
);

export default function Upload() {
  return (
    <main className="min-h-screen flex-col py-20 px-4 md:px-32 bg-zinc-900 text-white grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
      <Container>
        <h1 className="text-2xl font-bold">File Uploader</h1>
        <FileUploader
          url={url}
          maxFileSize={10000}
        />
      </Container>
    </main>
  );
}
