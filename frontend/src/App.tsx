import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './App.css';

import type {Validation} from '../../library/src/index';

type ValidationResponse = {
  [key: string]: Validation | {error: string}
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

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
        const results = await response.json() as ValidationResponse;
        console.log(results);
      } else {
        console.error('HTTP error:', response.status);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div className="App">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;