import React, {useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import './styles.css';


interface Props {

    onFileUploaded: (file: File) => void; // This atribute is a funcion with a File parameter and returns void!

}

// React.FC will bound our interface to our component
const Dropzone: React.FC<Props> = ({ onFileUploaded } ) => {

    const [selectedFileURL, setSelectedFileURL] = useState('');

    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0]; // because it is just one file we use '0'

        const fileURL = URL.createObjectURL(file);

        setSelectedFileURL(fileURL);
        onFileUploaded(file);

  }, [onFileUploaded])

  const {getRootProps, getInputProps} = useDropzone({ onDrop, accept: 'image/*' })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" /> { /* if we want multiple files, asign here! */}

        { selectedFileURL ? <img src={selectedFileURL} alt="Point thumbnail" /> 
                          : (<p> <FiUpload /> Drop the files here ...</p>)
        }        
      
    </div>
  )
}

export default Dropzone;