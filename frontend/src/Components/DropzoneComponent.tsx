import { useDropzone } from 'react-dropzone';

export default function DropzoneComponent({ onDrop, handleUpload }: { onDrop: (acceptedFiles: File[]) => void; handleUpload: () => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center justify-center rounded-md p-4">
      <div {...getRootProps()} className="flex items-center justify-center h-36 md:w-6/12 border-2 border-dashed rounded-lg p-4 bg-gray-200">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop a PDF file here, or click to select file</p>}
      </div>
      <button onClick={handleUpload} className="mt-8 px-4 py-2 w-6/12 text-white font-semibold rounded-md bg-bright-purple hover:bg-dark-purple">
        Submit
      </button>
    </div>
  );
}
