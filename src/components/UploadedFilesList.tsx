import { FileText, X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed";
}

interface UploadedFilesListProps {
  files: FileWithProgress[];
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
  hasPendingFiles: boolean;
}

const UploadedFilesList = ({ files, onRemoveFile, onUpload, hasPendingFiles }: UploadedFilesListProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="border-t border-border p-4 bg-secondary/30 max-h-40">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">
          Files ({files.length})
        </p>
        {hasPendingFiles && (
          <Button
            size="sm"
            onClick={onUpload}
            className="h-7 text-xs gap-1 bg-gradient-to-r from-primary to-primary-glow"
          >
            <Upload className="h-3 w-3" />
            Upload Files
          </Button>
        )}
      </div>
      <ScrollArea className="h-24">
        <div className="space-y-2">
          {files.map((fileWithProgress, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border
                         hover:border-primary/50 transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                {fileWithProgress.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {fileWithProgress.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileWithProgress.file.size)}
                </p>
                {fileWithProgress.status === "uploading" && (
                  <Progress value={fileWithProgress.progress} className="h-1 mt-1" />
                )}
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive/50"
                onClick={() => onRemoveFile(index)}
                disabled={fileWithProgress.status === "uploading"}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UploadedFilesList;
