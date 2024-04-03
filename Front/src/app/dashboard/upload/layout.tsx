import BreadCrumb from "@/components/breadCrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [{ title: "Upload", link: "/dashboard/upload" }];
export default function page({ children}: { children: React.ReactNode}) {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title="Upload" description="upload your files here" emoji="📤"/>
      </div>
        {children}
    </ScrollArea>
  );
}