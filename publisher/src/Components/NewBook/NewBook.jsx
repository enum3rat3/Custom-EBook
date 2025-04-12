import React, { useEffect, useState } from 'react'
import './NewBook.css'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  TextField
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import PdfViewer from './test'
import { useKeycloak } from '@react-keycloak/web'
import { useDispatch, useSelector } from 'react-redux'
import CustomLoadingPage from '../../Utils/CustomLoadingPage'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Typography } from '@mui/material'
import { publishBook } from '../../Store/publisherReducer'
import { useNavigate } from 'react-router'
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
  const navigate = useNavigate()
  const publisher = useSelector(state => state.publisher)
  const [value, setValue] = useState('1')
  const [filename, setFileName] = useState('')
  const [fileLocalPath, setFileLocalPath] = useState(null)
  const [fileS3Path, setFileS3Path] = useState(null)
  const [mediaProgress, setMediaProgress] = useState(false)
  const [bookTitle, setBookTitle] = useState('')

  const handleValueChange = event => {
    const inputValue = event.target.value

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === '') {
      setValue(inputValue)
    }
  }

  const handleBlur = () => {
    if (value === '' || parseInt(value, 10) < 1) {
      setValue('1')
    }
  }

  const handleTitleChange = event => {
    const inputValue = event.target.value
    setBookTitle(inputValue)
  }

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
        formData,
        {
          params: {
            bookName: fileNameWithoutExtension
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            Accept: 'application/json'
          }
        }
      )

      if (response.data) {
        console.log('Uploaded PDF URL:', response.data)
        setFileName(fileNameWithoutExtension)
        setFileLocalPath(response.data.localPath)
        const temp = 'https://' + response.data.s3Path
        setFileS3Path(temp)
        toast.success('pdf uploaded successfully')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('pdf upload failed')
    } finally {
      setMediaProgress(false)
    }
  }

  const submitBook = () => {
    try{

      dispatch(
        publishBook({
          jwt: keycloak.token,
          bookName: bookTitle,
          localPath: fileLocalPath,
          s3path: fileS3Path,
          bookPrice: parseInt(value, 10),
          pubId: keycloak.tokenParsed?.email
        })
      )
      toast.success('book publish successfully.')
      navigate('/my-books')
    }catch(e){
      toast.error('internal server error try again.')
    }
  }

  useEffect(() => {}, [publisher.loading])
  if (publisher.loading) {
    return <CustomLoadingPage />
  }
  if (!initialized) {
    return <CustomLoadingPage />
  }

  return (
    <div className='m-3 p-3 newbook-main'>
      <div className='left-panel p-3'>
        <FormControl variant='filled' fullWidth className='gap-3'>
          <TextField
            id='outlined-basic'
            label='BOOK TITLE'
            variant='outlined'
            value={bookTitle}
            onChange={handleTitleChange}
          />
          <TextField
            id='outlined-basic'
            label='PRICE (INR)'
            variant='outlined'
            type='text' // Use text to control input behavior
            value={value}
            onChange={handleValueChange}
            onBlur={handleBlur}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensures only numeric input
          />
          <div className='flex flex-row items-center space-x-2'>
            {mediaProgress ? (
              <Button
                variant='contained'
                sx={{ backgroundColor: '#1F2937', minHeight: '55px' }}
                disabled
              >
                <CircularProgress size={24} color='inherit' />
                {/* Uploading.... */}
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
          {mediaProgress ? (
            <Button
              variant='contained'
              sx={{ backgroundColor: '#1F2937', minHeight: '55px' }}
              disabled
            >
              <CircularProgress size={24} color='inherit' />
              Uploading....
            </Button>
          ) : (
            <Button
              variant='contained'
              sx={{ backgroundColor: '#1F2937', minHeight: '55px' }}
              onClick={submitBook}
            >
              PUBLISH BOOK
            </Button>
          )}
        </FormControl>
      </div>

      <div className='right-panel'>
        {fileS3Path ? (
          <PdfViewer pdfUrl={fileS3Path} />
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100%'
            width='100%'
            textAlign='center'
            sx={{ bgcolor: '#f9fafb' }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 80, color: '#9ca3af', mb: 2 }} />
            <Typography variant='h5' color='text.secondary' gutterBottom>
              No PDF Preview Available
            </Typography>
          </Box>
        )}
      </div>
    </div>
  )
}

export default NewBook
