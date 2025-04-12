import * as React from 'react'
import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary, {
  accordionSummaryClasses
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import PdfViewer from '../NewBook/test'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Grid, LinearProgress, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { getBookById, getBookChunks } from '../../Store/publisherReducer'
import { href, useNavigate, useParams } from 'react-router'
import { useKeycloak } from '@react-keycloak/web'
import CustomLoadingPage from '../../Utils/CustomLoadingPage'
import { useDispatch, useSelector } from 'react-redux'

const Accordion = styled(props => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}))

const AccordionSummary = styled(props => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    transform: 'rotate(90deg)'
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)'
  })
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})
const array = [1]

const ChunkList = () => {

  const { keycloak, initialized } = useKeycloak()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const publisher = useSelector(state => state.publisher)
  const { id } = useParams();


  const [expanded, setExpanded] = useState('panel0')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('1')
  const [startingPageNo, setStartingPageNo] = useState('1')
  const [endingPageNo, setEndingPageNo] = useState('1')

  const handleClickOpen = () => {
    setOpen(true)
  }


  const handleClose = () => {
    setOpen(false)
  }

  const handlePriceChange = event => {
    const inputValue = event.target.value

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === '') {
      setValue(inputValue)
    }
  }

  const handleStartingPageChange = event => {
    const inputValue = event.target.value

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === '') {
      setStartingPageNo(inputValue)
    }
  }


  const handleEndingPageChange = event => {
    const inputValue = event.target.value

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === '') {
      setEndingPageNo(inputValue)
    }
  }

  const handleBlur = () => {
    // Ensure value is not empty or zero when user leaves the field
    if (value === '' || parseInt(value, 10) < 1) {
      setValue('1') // Set minimum value to 1 (or adjust as needed)
    }
  }



  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const createChunk = () => {

    const p = parseInt(value, 10)
    const sp = parseInt(startingPageNo, 10)
    const ep = parseInt(endingPageNo, 10)

    if (sp > ep) {
      toast.info("Starting Page Must Be  <= Ending Page")
      return;
    }

    try {
      dispatch(createChunk({
        jwt: keycloak.token,
        bookId: id,
        startPage: sp,
        endPage: ep,
        chPrice: p
      }))
      toast.success('Chunk Created Successfully')
      
    } catch (error) {
      toast.error('Error While Creating Chunk. Try Again!!!! ')
    }
    handleClose();




  }

  const getFileNameWithoutExtension = (url) => {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return fileName.replace('.pdf', '');
  }



  useEffect(() => {
    try {
      console.log(id)
      dispatch(getBookById({ jwt: keycloak.token, bookId: id }))
      dispatch(getBookChunks({ jwt: keycloak.token, bookId: parseInt(id, 10) }))
    } catch (error) {
      toast.error("internal server error")
      navigate("/");
    }
  }, [])


  if (!initialized) {
    return <CustomLoadingPage />
  }

  if (publisher.BookById) {
    return (
      <div className='m-3 flex flex-col gap-3 h-screen '>
        <Card sx={{ display: 'flex', width: '100%', height: 150 }}>
          <CardMedia
            component='img'
            sx={{ width: 300, borderRadius: 2 }}
            image='http://4.bp.blogspot.com/-4UB7EoORmD8/UzWi-cH_iRI/AAAAAAAACm0/xdiq_4oATCg/s1600/o-BALD-EAGLE-free.jpg'
            alt='green iguana'
          />
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component='div' variant='h5'>
              {publisher.BookById.bkName}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Lizards are a widespread group of squamate reptiles, with over 6,000
              species, ranging across all continents except Antarctica
            </Typography>
            <CardActions sx={{ p: 0, mt: 1 }}>
              <Button
                size='small'
                sx={{
                  minWidth: '130px',
                  minHeight: '30px',
                  display: 'flex', // Ensures proper flexbox behavior
                  alignItems: 'center', // Centers vertically
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  backgroundColor: '#1F2937'
                }}
                onClick={handleClickOpen}
              >
                Create-Chunk
              </Button>
              <a
                href={publisher.BookById.bkS3Path}
                target="_blank"
                rel="noopener noreferrer" // Adds security
              >
                <Button
                  size='small'
                  sx={{
                    minWidth: '130px',
                    minHeight: '30px',
                    display: 'flex', // Ensures proper flexbox behavior
                    alignItems: 'center', // Centers vertically
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    backgroundColor: '#1F2937'
                  }}


                >
                  View Book
                </Button>
              </a>

              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby='alert-dialog-slide-description'
                PaperProps={{
                  sx: {
                    width: '90%',        // Default width for small screens
                    maxWidth: '800px',   // Maximum width on larger screens
                    '@media (min-width: 600px)': {
                      width: '70%',     // 70% width on medium screens
                    },
                    '@media (min-width: 900px)': {
                      width: '50%',     // 50% width on larger screens
                    },
                    borderRadius: 2
                  },
                }}
              >
                <DialogTitle>{'CREATE CHUNK'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-slide-description'>
                    <FormControl variant='filled' fullWidth className='gap-3 p-2'>
                      <TextField
                        id='outlined-basic'
                        label='PRICE (INR)'
                        variant='outlined'
                        type='text' // Use text to control input behavior
                        value={value}
                        onChange={handlePriceChange}
                        onBlur={handleBlur}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensures only numeric input
                      />
                      <TextField
                        id='outlined-basic'
                        label='STARTING PAGE NO'
                        variant='outlined'
                        type='text'
                        value={startingPageNo}
                        onChange={handleStartingPageChange}
                        onBlur={handleBlur}
                        inputProps={{ min: 1, inputMode: 'numeric', pattern: '[0-9]*' }}
                      />
                      <TextField
                        id='outlined-basic'
                        label='ENDING PAGE NO'
                        variant='outlined'
                        type='text'
                        value={endingPageNo}
                        onChange={handleEndingPageChange}
                        onBlur={handleBlur}
                        inputProps={{ min: 1, inputMode: 'numeric', pattern: '[0-9]*' }}
                      />
                    </FormControl>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>

                  <Button
                    size='small'
                    sx={{
                      minWidth: '130px',
                      minHeight: '40px',
                      display: 'flex', // Ensures proper flexbox behavior
                      alignItems: 'center', // Centers vertically
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      backgroundColor: '#1F2937',
                      marginRight: 3
                    }}
                    onClick={createChunk}
                  >
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </CardActions>
          </CardContent>
        </Card>
        <h1 className='mb-2 font-bold font-mono'> Chunk Details : </h1>
        <div className='flex-1 overflow-y-auto'>
          {publisher.ChunksOfBook &&
            publisher.ChunksOfBook.map((data, idx) => (
              <Accordion
                sx={{ marginTop: 2, borderRadius: 2, boxShadow: 3 }}
                key={idx}
                expanded={expanded === `panel+${idx}`}
                onChange={handleChange(`panel+${idx}`)}
              >
                <AccordionSummary
                  aria-controls='panel1d-content'
                  id='panel1d-header'
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography component='span'>
                      {getFileNameWithoutExtension(data.chS3Path)}
                    </Typography>
                    <Typography component='span'>
                      {data.chPrice + " Rs."}
                    </Typography>
                  </div>


                </AccordionSummary>
                <AccordionDetails>
                  <div className='flex align-center justify-center'>
                    <PdfViewer pdfUrl={"https://" + data.chS3Path} />
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
      </div>
    )

  }

  return (

    <h1>No Book Present With Given BookId</h1>
  )
}

export default ChunkList
