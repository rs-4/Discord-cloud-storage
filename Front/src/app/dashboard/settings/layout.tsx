import BreadCrumb from "@/components/breadCrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";


const breadcrumbItems = [{ title: "Settings", link: "/dashboard/settings" }];
export default function page({ children}: { children: React.ReactNode}) {
  return (
    <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title="Settings " description="set your params" emoji="⚙️"/>
        {children}
      </div> 
      
    </ScrollArea>

  );
}