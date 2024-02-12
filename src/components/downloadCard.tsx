import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
} from "@nextui-org/react";
import { FileInfo, Download } from "@/app/download/page";

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
    <Card key={item.id}>
      <CardHeader>
        <p>{item.name}</p>
      </CardHeader>
      <CardBody>
        <Button
          isLoading={download?.active}
          color="secondary"
          onPress={(e) => {
            setDownloadStarter({
              id: item.id,
              active: true,
              name: item.name,
            });
          }}
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
        >
          {download?.active ? "downloading..." : "click to download"}
        </Button>
        {download?.active && (
          <Progress
            size="sm"
            value={progress}
            showValueLabel={true}
            aria-label="Downloading..."
            className="max-w-md"
          />
        )}
      </CardBody>
    </Card>
  );
};

export default downloadCard;