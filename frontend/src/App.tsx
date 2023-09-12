import { useCallback, useState } from 'react';
import DropzoneComponent from './Components/DropzoneComponent';
import './App.css';

import type { Validation } from '../../library/src/index';

type ValidationResponse = {
  [key: string]: Validation | { error: string };
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ValidationResponse>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const handleUpload = async () => {
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
        console.log(results);
        setResults(results);
      } else {
        console.error('HTTP error:', response.status);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="App">
      <DropzoneComponent onDrop={onDrop} handleUpload={handleUpload} />
      {results && <>Results</>}
    </div>
  );
}

export default App;
