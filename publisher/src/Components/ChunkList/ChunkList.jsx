import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import PdfViewer from "../NewBook/test";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  CircularProgress,
  Grid,
  LinearProgress,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  createChunk,
  deleteBook,
  deleteChunk,
  getBookById,
  getBookChunks,
} from "../../Store/publisherReducer";
import { href, useNavigate, useParams } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import { useDispatch, useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box } from "@mui/material";
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const array = [1];

const ChunkList = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const publisher = useSelector((state) => state.publisher);
  const { id } = useParams();

  const [expanded, setExpanded] = useState("panel0");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [startingPageNo, setStartingPageNo] = useState("");
  const [endingPageNo, setEndingPageNo] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValue("");
    setEndingPageNo("");
    setStartingPageNo("");
    setOpen(false);
  };

  const handlePriceChange = (event) => {
    const inputValue = event.target.value;

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === "") {
      setValue(inputValue);
    }
  };

  const handleStartingPageChange = (event) => {
    const inputValue = event.target.value;

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === "") {
      setStartingPageNo(inputValue);
    }
  };

  const handleEndingPageChange = (event) => {
    const inputValue = event.target.value;

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === "") {
      setEndingPageNo(inputValue);
    }
  };

  const handleBlur = () => {
    // Ensure value is not empty or zero when user leaves the field
    if (value === "" || parseInt(value, 10) < 1) {
      setValue(""); // Set minimum value to 1 (or adjust as needed)
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const createChunkhandler = () => {
    const p = parseInt(value, 10);
    const sp = parseInt(startingPageNo, 10);
    const ep = parseInt(endingPageNo, 10);

    if (sp > ep) {
      toast.info("Starting Page Must Be  <= Ending Page");
      return;
    }

    try {
      dispatch(
        createChunk({
          jwt: keycloak.token,
          bookId: parseInt(id, 10),
          startPage: sp,
          endPage: ep,
          chPrice: p,
        })
      );
      toast.success("Chunk Created Successfully");
      handleClose();
      navigate(`/my-book/${parseInt(id, 10)}`);
    } catch (error) {
      toast.error("Error While Creating Chunk. Try Again!!!! ");
      handleClose();
      return;
    }
  };

  const getFileNameWithoutExtension = (url) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.replace(".pdf", "");
  };

  const handleDeleteBook = () => {
    try {
      dispatch(deleteBook({ jwt: keycloak.token, bookId: parseInt(id, 10) }));
      toast.success("book deleted successfully!!");
      navigate("/my-books");
    } catch (error) {
      toast.error("error while deleting Book");
    }
  };

  const deleteChunkHandler = (data) => {
    try {
      dispatch(
        deleteChunk({ jwt: keycloak.token, chunkId: parseInt(data.chId, 10) })
      );
      toast.success("chunk deleted successfully!!");
    } catch (error) {
      toast.error("error while deleting Chunk");
    }
  };

  useEffect(() => {
    try {
      dispatch(getBookById({ jwt: keycloak.token, bookId: parseInt(id, 10) }));
      dispatch(
        getBookChunks({ jwt: keycloak.token, bookId: parseInt(id, 10) })
      );
    } catch (error) {
      toast.error("internal server error");
      navigate("/");
    }
  }, []);

  if (!initialized) {
    return <CustomLoadingPage />;
  }

  if (publisher.loading) {
    return <CustomLoadingPage />;
  }

  if (publisher?.BookById != null) {
    return (
      <div className="m-3 flex flex-col gap-3 h-screen overflow-y-auto ">
        <Card
          sx={{ display: "flex", width: "100%", minHeight: 150, height: 150 }}
        >
          <CardMedia
            component="img"
            sx={{ width: 300, borderRadius: 2 }}
            image={publisher.BookById.bkS3CoverImagePath}
            alt={publisher.BookById.bkName}
          />
          <CardContent sx={{ flex: "1 0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div>
                <Typography
                  component="div"
                  variant="h5"
                  className="uppercase tracking-wide font-semibold"
                >
                  {publisher.BookById.bkName}
                </Typography>
              </div>
              <div style={{ display: "flex" }}>
                <span>Price : </span>
                <span>{publisher.BookById.bookPrice + " Rs."}</span>
              </div>
            </div>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {publisher.BookById.bkDesc}
            </Typography>
            <CardActions sx={{ p: 0, mt: 1 }}>
              <Button
                size="small"
                sx={{
                  minWidth: "130px",
                  minHeight: "30px",
                  display: "flex", // Ensures proper flexbox behavior
                  alignItems: "center", // Centers vertically
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                  backgroundColor: "#1F2937",
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
                  size="small"
                  sx={{
                    minWidth: "130px",
                    minHeight: "30px",
                    display: "flex", // Ensures proper flexbox behavior
                    alignItems: "center", // Centers vertically
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.75rem",
                    backgroundColor: "#1F2937",
                  }}
                >
                  View Book
                </Button>
              </a>
              <Button
                size="small"
                sx={{
                  minWidth: "130px",
                  minHeight: "30px",
                  display: "flex", // Ensures proper flexbox behavior
                  alignItems: "center", // Centers vertically
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                  backgroundColor: "red",
                }}
                onClick={() => handleDeleteBook()}
              >
                Delete Book
              </Button>

              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                  sx: {
                    width: "90%", // Default width for small screens
                    maxWidth: "800px", // Maximum width on larger screens
                    "@media (min-width: 600px)": {
                      width: "70%", // 70% width on medium screens
                    },
                    "@media (min-width: 900px)": {
                      width: "50%", // 50% width on larger screens
                    },
                    borderRadius: 2,
                  },
                }}
              >
                <DialogTitle>{"CREATE CHUNK"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    <FormControl
                      variant="filled"
                      fullWidth
                      className="gap-3 p-2"
                    >
                      <TextField
                        id="outlined-basic"
                        label="PRICE (INR)"
                        variant="outlined"
                        type="text" // Use text to control input behavior
                        value={value}
                        onChange={handlePriceChange}
                        onBlur={handleBlur}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // Ensures only numeric input
                      />
                      <TextField
                        id="outlined-basic"
                        label="STARTING PAGE NO"
                        variant="outlined"
                        type="text"
                        value={startingPageNo}
                        onChange={handleStartingPageChange}
                        onBlur={handleBlur}
                        inputProps={{
                          min: 1,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                      />
                      <TextField
                        id="outlined-basic"
                        label="ENDING PAGE NO"
                        variant="outlined"
                        type="text"
                        value={endingPageNo}
                        onChange={handleEndingPageChange}
                        onBlur={handleBlur}
                        inputProps={{
                          min: 1,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                      />
                    </FormControl>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    size="small"
                    sx={{
                      minWidth: "130px",
                      minHeight: "40px",
                      display: "flex", // Ensures proper flexbox behavior
                      alignItems: "center", // Centers vertically
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.75rem",
                      backgroundColor: "#1F2937",
                      marginRight: 3,
                    }}
                    onClick={createChunkhandler}
                  >
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </CardActions>
          </CardContent>
        </Card>
        <h1 className="mb-2 font-bold font-mono"> Chunk Details : </h1>
        {publisher.ChunksOfBook.length > 0 ? (
          <div className="flex-1 overflow-y-auto min-h-[80%]">
            {publisher.ChunksOfBook.map((data, idx) => (
              <Accordion
                sx={{ marginTop: 2, borderRadius: 2, boxShadow: 3 }}
                key={idx}
                expanded={expanded === `panel+${idx}`}
                onChange={handleChange(`panel+${idx}`)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="span">
                      {getFileNameWithoutExtension(data.chS3Path)}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Typography component="span">
                        {data.chPrice + " Rs."}
                      </Typography>
                      <Button>
                        <DeleteForeverIcon
                          sx={{ color: "red" }}
                          onClick={() => deleteChunkHandler(data)}
                        />
                      </Button>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex align-center justify-center">
                    <PdfViewer pdfUrl={"https://" + data.chS3Path} />
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 6,
              color: "gray",
              height: "50%",
              width: "100%",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              No Chunk Created Yet
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              You can start by uploading a new chapter or section.
            </Typography>
          </Box>
        )}
      </div>
    );
  }

  return <h1>No Book Present With Given BookId</h1>;
};

export default ChunkList;
