import { useCallback, useState } from 'react';
import DropzoneComponent from './Components/DropzoneComponent';
import ValidationResultsCard from './Components/ValidationResultsCard';
import Footer from './Components/Footer';
import './App.css';

import type { Validation } from '../../library/src/index';

type ValidationResponse = {
  [key: string]: Validation | { error: string };
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<ValidationResponse>();
  const fileNames = files.map((file) => file.name);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    if (!files || !files.length) return;
    const formData = new FormData();
    for (const file of files) {
      formData.append(file.name, file);
    }

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const results = (await response.json()) as ValidationResponse;
        setResults(results);
      } else {
        console.error('HTTP error:', response.status);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] sm:h-[94vh] justify-between">
      <div className="lg:mx-24 lg:px-16">
        <div className="overflow-hidden rounded-lg shadow mb-6 bg-light-purple">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-center px-2 py-1 rounded-md font-semibold text-4xl font-sans">Validate a Criipto Signatures document</h1>
            <p className="p-4 text-center">Here you can validate signed PDF files and view information included in the signatures.</p>
            <DropzoneComponent onDrop={onDrop} handleUpload={handleUpload} fileNames={fileNames} uploading={uploading} />
          </div>
        </div>
        {results && 'error' in results ? <p>Error validating file</p> : results && <ValidationResultsCard results={results} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
