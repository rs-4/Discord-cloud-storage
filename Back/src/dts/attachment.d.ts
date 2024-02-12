interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type: string | undefined;
  content_scan_version: number | undefined;
}

export default Attachment;