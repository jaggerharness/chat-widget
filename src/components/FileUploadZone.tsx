import { useCallback } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUploadZone = ({ onFilesSelected }: FileUploadZoneProps) => {
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      
      if (files.length === 0) return;

      // Filter for document types
      const validFiles = files.filter((file) => {
        const validTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        return validTypes.includes(file.type);
      });

      if (validFiles.length !== files.length) {
        toast({
          title: "Some files were skipped",
          description: "Only PDF, Word, Excel, and text files are supported",
          variant: "destructive",
        });
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
        toast({
          title: "Files uploaded",
          description: `${validFiles.length} file(s) added successfully`,
        });
      }
    },
    [onFilesSelected, toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) added successfully`,
      });
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border rounded-xl p-6 text-center 
                 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300
                 cursor-pointer group"
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="text-sm font-medium text-foreground mb-1">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, Word, Excel, or Text files
        </p>
      </label>
    </div>
  );
};

export default FileUploadZone;