import React, { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PdfViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const defaultPdfWidth = 1400 // PDF default width
        const newScale = containerWidth / defaultPdfWidth
        setScale(newScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div
       ref={containerRef}
      style={{
        width: '80%',
        height: '100%',
        overflow: 'hidden',
       
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        
      }}
    >
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',width:'100%'}}>
      <div className=' p-5'>
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: pageNumber <= 1 ? '#ccc' : '#1F2937', // Disable color
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            marginRight: '10px'
          }}
        >
         <ArrowBackIosNewIcon/>
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>

        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: pageNumber >= numPages? '#ccc' : '#1F2937', // Disable color
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            marginLeft: '10px',
            
          }}
        >
          <NavigateNextIcon/>
        </button>
      </div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} scale={scale}   />
      </Document>
      </div>
    </div>
  )
}

export default PdfViewer
