import { useCallback, useState } from 'react';
import IdentityDetails from './Components/IdentityDetails';
import DropzoneComponent from './Components/DropzoneComponent';
import IdentityEvidence from './Components/IdentityEvidence';
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
      {results && (
        <>
          {/* Basic Card With Header / Panel: https://tailwindui.com/components/application-ui/layout/panels#component-b06139aa884a8756e29cc4cd080995cb */}
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-20">
            <div className="px-4 py-5 sm:px-6 bg-dark-purple text-white font-semibold">VALIDATION RESULTS</div>
            <div className="px-4 py-5 sm:p-6">
              {Object.entries(results).map(([fileName, result]) => (
                <div key={fileName}>
                  {'error' in result ? (
                    <p>Error validating file: {result.error}</p>
                  ) : (
                    <>
                      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mb-6">
                        <div className="px-4 py-5 sm:px-6 bg-light-purple text-white font-semibold">DOCUMENT INFORMATION</div>
                        <div className="px-4 py-5 sm:p-6">File Name: {fileName}</div>
                        <div className="px-4 py-5 sm:p-6">Signatures: {result.signatures.length}</div>
                      </div>
                      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:px-6 bg-light-purple text-white font-semibold">IDENTITY EVIDENCE / SIGNATURE</div>
                        <div className="px-4 py-5 sm:p-6">
                          <div className="px-4 py-5 sm:px-6">
                            {result.type === 'pades' &&
                              result.signatures &&
                              (result.signatures.length === 0 ? (
                                <p>No signatures in this PDF file</p>
                              ) : (
                                <ul>
                                  {result.signatures.map((signature, index) => (
                                    <div key={index}>
                                      <li key={index}>Signature type: {signature.type}</li>
                                      {signature.type === 'criipto.signature.jwt' && (
                                        <ul>
                                          <li key={`identity-${index}`}>
                                            <IdentityDetails identityData={signature.identity} />
                                          </li>
                                          <li key={`evidence-${index}`}>
                                            <IdentityEvidence evidenceData={signature.evidence} />
                                          </li>
                                        </ul>
                                      )}
                                    </div>
                                  ))}
                                </ul>
                              ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
