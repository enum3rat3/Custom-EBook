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
import { getBookById } from "../../Store/consumerReducer";
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
  const consumer = useSelector((state) => state.consumer);
  const { id } = useParams();
  const [expanded, setExpanded] = useState("panel0");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const getFileNameWithoutExtension = (url) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.replace(".pdf", "");
  };

  useEffect(() => {
    try {
      dispatch(getBookById({ bookId: parseInt(id, 10) }));
    } catch (error) {
      toast.error("internal server error");
      navigate("/");
    }
  }, []);

  useEffect(()=>{
  
  },[consumer.loading])

  if (!initialized) {
    return <CustomLoadingPage />;
  }

  if (consumer.loading) {
    return <CustomLoadingPage />;
  }

  if (consumer?.BookById != null) {
    return (
      <div className="m-3 flex flex-col gap-3 h-screen overflow-y-auto ">
        <Card
          sx={{ display: "flex", width: "100%", minHeight: 150, height: 150 }}
        >
          <CardMedia
            component="img"
            sx={{ width: 300, borderRadius: 2 }}
            image={consumer.BookById.bkS3CoverImagePath}
            alt={consumer.BookById.bkName}
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
                  {consumer.BookById.bkName}
                </Typography>
              </div>
              <div style={{ display: "flex" }}>
                <span>Price : </span>
                <span>{consumer.BookById.bookPrice + " Rs."}</span>
              </div>
            </div>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {"Publish By : " + consumer.BookById.publisher}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                maxHeight: 60,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {consumer.BookById.bkDesc}
            </Typography>
            <CardActions sx={{ p: 0, mt: 1 }}></CardActions>
          </CardContent>
        </Card>
        <h1 className="mb-2 font-bold font-mono"> Chunk Details : </h1>
        {consumer.BookById.chunks && consumer.BookById.chunks.length > 0 ? (
          <div className="flex-1 overflow-y-auto min-h-[80%]">
            {consumer.BookById.chunks.map((data, idx) => (
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
                        {"Price: "+data.chPrice + " Rs."}
                      </Typography>
                      <Button
                        sx={{
                          backgroundColor: "#1F2937",
                          color: "#FFFFFF",
                          "&:hover": {
                            backgroundColor: "#374151",
                          },
                          textTransform: "none", // optional: disables ALL CAPS
                        }}
                      >
                        <p>Add To Cart</p>
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
              No Chunk Created Yet For This Book
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Explore Other Books.
            </Typography>
          </Box>
        )}
      </div>
    );
  }

  return <h1>No Book Present With Given BookId</h1>;
};

export default ChunkList;
