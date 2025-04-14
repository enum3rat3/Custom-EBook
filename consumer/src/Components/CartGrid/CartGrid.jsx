import React, { useState, useCallback, useEffect } from "react";
import {
  Typography,
  IconButton,
  styled,
  FormControl,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PdfViewer from "../NewBook/test";
import { useDispatch, useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import { deleteFromCart, generateBook } from "../../Store/consumerReducer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Slide from "@mui/material/Slide";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ItemType = "CARD";

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

const CardItem = ({
  data,
  index,
  moveCard,
  onDelete,
  expandedPanel,
  handleAccordionChange,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index === index) return;
      moveCard(item.index, index);
      item.index = index;
    },
  });

  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  drag(drop(ref));

  const getFileNameWithoutExtension = (url) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.replace(".pdf", "");
  };

  return (
    <div ref={ref} className=" cursor-move w-full">
      <Accordion
        sx={{ marginTop: 2, borderRadius: 2, boxShadow: 3 }}
        expanded={expandedPanel === index}
        onChange={() => handleAccordionChange(index)}
      >
        <AccordionSummary>
          <div className="flex justify-between items-center w-full">
            <Typography component="span">
              {getFileNameWithoutExtension(data.chS3Path)}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography component="span">
                {"Price: " + data.chPrice + " Rs."}
              </Typography>
              <IconButton
                onClick={() => onDelete(index, data.chId)}
                size="medium"
              >
                <DeleteIcon style={{ color: "red" }} />
              </IconButton>
              <DragIndicatorIcon style={{ color: "gray" }} />
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex align-center justify-center">
            <PdfViewer pdfUrl={`https://${data.chS3Path}`} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const CartGrid = () => {
  const { keycloak, initialized } = useKeycloak();
  const consumer = useSelector((state) => state.consumer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.consumer.cartItems);
  const [cards, setCards] = useState(cartItems || []);
  const [expandedPanel, setExpandedPanel] = useState(null); // 👈
  const [bookTitle, setBookTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const moveCard = useCallback((from, to) => {
    setCards((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const deleteCard = useCallback(
    (index, chId) => {
      try {
        dispatch(
          deleteFromCart({
            jwt: keycloak.token,
            email: keycloak?.tokenParsed.email,
            chunkId: chId,
          })
        );
        toast.success("chunk removed from cart");
      } catch (error) {
        toast.error("error while removing chunk from cart");
      }
      const updated = cards.filter((_, i) => i !== index);
      setCards(updated);
    },
    [cards, dispatch]
  );

  const handleAccordionChange = (panelIndex) => {
    setExpandedPanel((prev) => (prev === panelIndex ? null : panelIndex));
  };

  const sumResult = () => cards.reduce((acc, curr) => acc + curr.chPrice, 0);

  const handleGenerateBook = async () => {
    if (!bookTitle.length) {
      toast.info("Enter Book Title");
      return;
    }
  
    const newChunkIds = cards.map((item) => parseInt(item.chId, 10));
  
    const payload = {
      newTitle: bookTitle,
      email: keycloak?.tokenParsed.email,
      chunkIds: newChunkIds,
    };
  
    try {
      await dispatch(generateBook({ jwt: keycloak.token, newBookDTO: payload }));
      
      // Optional: simulate delay
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Book generated Successfully");
      navigate("/orders");
    } catch (error) {
      toast.error("Error while generating book!");
    } finally {
    }
  };
  

  if (!initialized || consumer.loading) {
    return <CustomLoadingPage />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex   text-center justify-center"></div>
      {cards && cards.length > 0 ? (
        <>
          <FormControl
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <TextField
              required
              id="outlined-basic"
              label="Book Title"
              variant="outlined"
              placeholder="Enter Book Title Here..."
              className="w-[400px]"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />

            <div className="flex gap-2">
              <TextField
                id="outlined-basic"
                label="Total Price(INR)."
                variant="filled"
                placeholder="Total Price(INR)."
                className="w-[200px]"
                value={sumResult()}
                InputProps={{
                  sx: {
                    color: "black", // 👈 Works the same way
                  },
                }}
              />

              <Button
                size="small"
                sx={{
                  minWidth: "130px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                  backgroundColor: "#1F2937",
                }}
                disabled={loading}
                onClick={handleGenerateBook}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Generate Book"
                )}
              </Button>
            </div>
          </FormControl>
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col">
              {cards.map((card, idx) => (
                <CardItem
                  key={idx}
                  data={card}
                  index={idx}
                  moveCard={moveCard}
                  onDelete={deleteCard}
                  expandedPanel={expandedPanel}
                  handleAccordionChange={handleAccordionChange}
                />
              ))}
            </div>
          </DndProvider>
        </>
      ) : (
        <h1>No Data Present</h1>
      )}
    </div>
  );
};

export default CartGrid;
