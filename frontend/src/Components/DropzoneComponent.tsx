import { useDropzone } from 'react-dropzone';

export default function DropzoneComponent({ onDrop, handleUpload }: { onDrop: (acceptedFiles: File[]) => void; handleUpload: () => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h1 className="text-center mt-2 mb-4 px-2 py-1">Validate a Signature</h1>
      <div {...getRootProps()} className="flex items-center justify-center h-36 w-96 border-2 border-dashed rounded-lg p-4 bg-gray-200">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Upload & Validate
      </button>
    </div>
  );
}
