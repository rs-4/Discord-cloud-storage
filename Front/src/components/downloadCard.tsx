import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { FileInfo, Download } from "../app/download/page";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { File, Trash2, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Tab } from "@nextui-org/react";

interface DownloadCardProps {
  item: FileInfo;
  download: Download | null;
  progress: number;
  setDownloadStarter: (download: Download) => void;
}

const downloadCard: React.FC<DownloadCardProps> = ({
  item,
  download,
  progress,
  setDownloadStarter,
}) => {
  return (
    <>
    <Table>
        <TableRow>
          <TableHead className="w-[100px]">File Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Download</TableHead>
        </TableRow>
        <TableRow>
          <TableBody>
          <TableCell><File/>{item.name}</TableCell>
          <TableCell>{item.size}</TableCell>
          <TableCell>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                setDownloadStarter({
                  id: item.id,
                  active: true,
                  name: item.name,
                });
              }}
            >
              Download
            </Button>
          </TableCell>
          </TableBody>
        </TableRow>
    </Table>
    </>
  
  );
};

export default downloadCard;