import React, { useRef, forwardRef, useImperativeHandle } from 'react';

interface FileUploadSectionProps {
  onCreateTemplate: () => void;
  onUploadClick: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FileUploadSectionRef {
  triggerFileInput: () => void;
}

const FileUploadSection = forwardRef<FileUploadSectionRef, FileUploadSectionProps>(({
  onCreateTemplate,
  onUploadClick,
  onFileUpload,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={onCreateTemplate}
        className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg font-medium text-gray-900">Download Template</span>
        <span className="text-sm text-gray-500">Get the Excel template</span>
      </button>

      <button
        onClick={onUploadClick}
        className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="text-lg font-medium text-gray-900">Upload Data</span>
        <span className="text-sm text-gray-500">Select CSV file</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileUpload}
        accept=".csv"
        className="hidden"
      />
    </div>
  );
});

FileUploadSection.displayName = 'FileUploadSection';

export default FileUploadSection;
