import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function DropzoneComponent({
  onDrop,
  handleUpload,
  fileNames,
  uploading,
}: {
  onDrop: (acceptedFiles: File[]) => void;
  handleUpload: () => void;
  fileNames: string[];
  uploading: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
  });

  const style: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: '20px',
    backgroundColor: '#fafafa',
    color: 'gray',
    minHeight: '200px',
  };

  function truncateFileName(fileName: string, maxLength: number) {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    const start = fileName.slice(0, maxLength / 2);
    const end = fileName.slice(-maxLength / 2);
    return `${start}...${end}`;
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-md p-4">
      <div {...getRootProps({ style })} className="flex items-center justify-center h-36 md:w-6/12 border-2 border-dashed rounded-lg p-4 bg-gray-200">
        <input {...getInputProps()} />
        {fileNames.length > 0 && !isDragActive ? (
          <ul>
            {fileNames.map((fileName, index) => (
              <li key={`${fileName}-${index}`} className="max-w-xs">
                {truncateFileName(fileName, 30)}
              </li>
            ))}
          </ul>
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop PDF files here, or click to select files</p>
        )}
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`mt-8 px-4 py-2 w-6/12 text-white font-semibold rounded-md ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-bright-purple  hover:bg-dark-purple'}`}
      >
        {uploading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}
      </button>
    </div>
  );
}
