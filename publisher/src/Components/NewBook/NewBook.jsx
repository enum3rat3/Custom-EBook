import React, { useEffect, useState } from 'react'
import './NewBook.css'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Button, Grid, LinearProgress, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import PdfViewer from './test'
import { useKeycloak } from '@react-keycloak/web'
import { useDispatch, useSelector } from 'react-redux'
import CustomLoadingPage from '../../Utils/CustomLoadingPage'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const NewBook = () => {
  const { keycloak, initialized } = useKeycloak()
  const dispatch = useDispatch()
  const { publisher } = useSelector(Store => Store)
  const [value, setValue] = useState('1')
  const [filename, setFileName] = useState('')
  const [fileLocalPath,setFileLocalPath]=useState(null);
  const [fileS3Path, setFileS3Path] = useState(null)
  const [mediaProgress, setMediaProgress] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)


  if (!initialized) {
    return <CustomLoadingPage />
  }

  const handleChange = event => {
    const inputValue = event.target.value

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === '') {
      setValue(inputValue)
    }
  }

  const handleBlur = () => {
    // Ensure value is not empty or zero when user leaves the field
    if (value === '' || parseInt(value, 10) < 1) {
      setValue('1') // Set minimum value to 1 (or adjust as needed)
    }
  }

  // const localPdfPath=(e)=>{

  //   const file = e.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     const localUrl = URL.createObjectURL(file);
  //     setFilePath(localUrl);
  //     setFileName(file.name);
  //   } else {
  //     alert("Please select a valid PDF file.");
  //   }
  // }

  const generateFileUrlPath = async event => {
    const file = event.target.files[0]

    if (!file) {
      toast.error('No file selected!')
      return
    }

    if (!(file instanceof Blob) || file.type !== 'application/pdf') {
      toast.error('Select a valid PDF File')
      return
    }


  const originalName = file.name
  const fileNameWithoutExtension = originalName.replace(/\.pdf$/i, '')

console.log('File name without extension:', fileNameWithoutExtension)

    const formData = new FormData()
    formData.append('book', file)

    setMediaProgress(true)
    try {
      console.log(keycloak.token)
      const response = await axios.post(
        'http://localhost:8081/api/publisher/upload',
        formData, // empty body
        {
          params: {
            bookName: fileNameWithoutExtension
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            Accept: 'application/json'
          },
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total))
          }
        }
      )

      if (response.data) {
        console.log('Uploaded PDF URL:', response.data)
        setFileName(fileNameWithoutExtension)
        setFileLocalPath(response.data.localPath)
        setFileS3Path("https://"+response.data.s3Path)
        toast.success('pdf uploaded successfully')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('pdf upload failed')
    } finally {
      setMediaProgress(false)
    }
  }

  const handlechange = () => {}
  return (
    <div className='m-3 p-3 newbook-main'>
      <div className='left-panel p-3'>
        <FormControl variant='filled' fullWidth className='gap-3'>
          <TextField
            id='outlined-basic'
            label='BOOK TITLE'
            variant='outlined'
          />
          <TextField
            id='outlined-basic'
            label='PRICE (INR)'
            variant='outlined'
            type='text' // Use text to control input behavior
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensures only numeric input
          />
          <div className='flex flex-row items-center space-x-2'>
            {mediaProgress ? (
              <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  fontSize: '0.75rem', // Reduce text size
                  minWidth: '100px',
                  minHeight: '55px',
                  display: 'flex', // Ensures proper flexbox behavior
                  alignItems: 'center', // Centers vertically
                  justifyContent: 'center', // Centers horizontally
                  gap: '4px',
                  backgroundColor: '#1F2937'
                }}
                disabled
              >
                Upload
                <VisuallyHiddenInput
                  type='file'
                  onChange={event => generateFileUrlPath(event)}
                />
              </Button>
            ) : (
              <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  fontSize: '0.75rem', // Reduce text size
                  minWidth: '100px',
                  minHeight: '55px',
                  display: 'flex', // Ensures proper flexbox behavior
                  alignItems: 'center', // Centers vertically
                  justifyContent: 'center', // Centers horizontally
                  gap: '4px',
                  backgroundColor: '#1F2937'
                }}
              >
                Upload
                <VisuallyHiddenInput
                  type='file'
                  onChange={event => generateFileUrlPath(event)}
                />
              </Button>
            )}
            <TextField
              id='outlined-basic'
              variant='outlined'
              placeholder='No File Chosen'
              value={[filename]}
            />
          </div>
          {mediaProgress && (
            <div className='my-4'>
              <LinearProgress
                variant='buffer'
                value={uploadProgress}
                valueBuffer={5}
              />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}
          {mediaProgress ? (
            <Button
              variant='contained'
              sx={{ backgroundColor: '#1F2937', minHeight: '55px' }}
              disabled
            >
              PUBLISH BOOK
            </Button>
          ) : (
            <Button
              variant='contained'
              sx={{ backgroundColor: '#1F2937', minHeight: '55px' }}
            >
              PUBLISH BOOK
            </Button>
          )}
        </FormControl>
      </div>

      <div className='right-panel'>
        {fileS3Path && (
          // <object
          //   data={filePath}
          //   type='application/pdf'
          //   width='100%'
          //   height='100%'
          // >
          //   <p>
          //     manully download <a href={filePath}> PDF!</a>
          //   </p>
          // </object>
          // <iframe src={filePath} width="100%" height="100%"></iframe>
          <PdfViewer pdfUrl={fileS3Path} />
        )}
      </div>
    </div>
  )
}

export default NewBook
