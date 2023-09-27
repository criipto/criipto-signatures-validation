import { useDropzone } from 'react-dropzone';

export default function DropzoneComponent({ onDrop, handleUpload, fileNames }: { onDrop: (acceptedFiles: File[]) => void; handleUpload: () => void; fileNames: string[] }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
          fileNames.map((fileName, index) => (
            <ul>
              <li key={index} className="max-w-xs">
                {truncateFileName(fileName, 30)}
              </li>
            </ul>
          ))
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop PDF files here, or click to select files</p>
        )}
      </div>
      <button onClick={handleUpload} className="mt-8 px-4 py-2 w-6/12 text-white font-semibold rounded-md bg-bright-purple hover:bg-dark-purple">
        Submit
      </button>
    </div>
  );
}
