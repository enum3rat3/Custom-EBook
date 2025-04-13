import React, { useEffect, useState } from "react";
import "./NewBook.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import PdfViewer from "./test";
import { useKeycloak } from "@react-keycloak/web";
import { useDispatch, useSelector } from "react-redux";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Typography } from "@mui/material";
import { publishBook } from "../../Store/publisherReducer";
import { useNavigate } from "react-router";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const NewBook = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const publisher = useSelector((state) => state.publisher);
  const [value, setValue] = useState("");
  const [filename, setFileName] = useState("");
  const [fileLocalPath, setFileLocalPath] = useState(null);
  const [fileS3Path, setFileS3Path] = useState(null);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePath, setCoverImagePath] = useState(null);

  const handleValueChange = (event) => {
    const inputValue = event.target.value;

    // Allow only whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(inputValue) || inputValue === "") {
      setValue(inputValue);
    }
  };

  const handleBlur = () => {
    if (value === "" || parseInt(value, 10) < 1) {
      setValue("");
    }
  };

  const handleTitleChange = (event) => {
    const inputValue = event.target.value;
    setBookTitle(inputValue);
  };

  const handleDescriptionChange = (event) => {
    const descValue = event.target.value;
    setBookDescription(descValue);
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    console.log(image);
    if (!image) {
      toast.error("No Image selected!");
      return;
    }
    const validImageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(image.type)) {
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, GIF, WEBP)"
      );
      return;
    }

    const imageUrl = URL.createObjectURL(image);

    setImagePreview(imageUrl);
    setCoverImage(image);
  };

  const generateFileUrlPath = async (event) => {

    if(!coverImage){
      toast.info("Upload Cover Image First")
      return;
    }
    const file = event.target.files[0];

    if (!file) {
      toast.error("No file selected!");
      return;
    }

    if (!(file instanceof Blob) || file.type !== "application/pdf") {
      toast.error("Select a valid PDF File");
      return;
    }

    const originalName = file.name;
    const fileNameWithoutExtension = originalName.replace(/\.pdf$/i, "");

    console.log("File name without extension:", fileNameWithoutExtension);

    const formData = new FormData();
    formData.append("book", file);
    formData.append("image", coverImage);

    setMediaProgress(true);
    try {
      console.log(keycloak.token);
      const response = await axios.post(
        "http://localhost:8081/api/publisher/upload",
        formData,
        {
          params: {
            bookName: fileNameWithoutExtension,
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Uploaded PDF URL:", response.data);
        setFileName(fileNameWithoutExtension);
        setFileLocalPath(response.data.localPath);
        const t = response.data.s3CoverImagePath;
        setCoverImagePath(t);
        const temp = "https://" + response.data.s3Path;
        setFileS3Path(temp);
        toast.success("pdf uploaded successfully");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("pdf upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  const submitBook = () => {

    if (
      !bookTitle.trim() ||
      !bookDescription.trim() ||
      !coverImagePath ||
      !fileLocalPath ||
      !fileS3Path ||
      !value
    ) {
      toast.error("Please fill in all fields and upload required files.");
      return;
    }
    try {
      dispatch(
        publishBook({
          jwt: keycloak.token,
          bookName: bookTitle,
          description: bookDescription,
          localPath: fileLocalPath,
          s3path: fileS3Path,
          s3CoverImagePath: coverImagePath,
          bookPrice: parseInt(value, 10),
          pubId: keycloak.tokenParsed?.email,
        })
      );
      toast.success("book publish successfully.");
      navigate("/my-books");
    } catch (e) {
      toast.error("internal server error try again.");
    }
  };

  useEffect(() => {}, [publisher.loading]);
  if (publisher.loading) {
    return <CustomLoadingPage />;
  }
  if (!initialized) {
    return <CustomLoadingPage />;
  }

  return (
    <div className="m-3 p-3 newbook-main ">
      <div className="left-panel p-3 ">
        <Typography variant="h5" align="center" gutterBottom>
          Publish Book
        </Typography>
        <FormControl variant="filled" fullWidth className="gap-3">
          <TextField
            id="outlined-basic"
            label="BOOK TITLE"
            variant="outlined"
            value={bookTitle}
            onChange={handleTitleChange}
            placeholder="Enter Book Title"
            required
          />

          <TextField
            id="book-description"
            label="DESCRIPTION"
            variant="outlined"
            value={bookDescription}
            onChange={handleDescriptionChange}
            placeholder="Enter Book Description"
            multiline
            rows={3}
            required
            sx={{
              "& .MuiInputBase-root textarea": {
                overflow: "auto",
                scrollbarWidth: "thin",
              },
              "& .MuiInputBase-root textarea::-webkit-scrollbar": {
                width: "6px",
              },
              "& .MuiInputBase-root textarea::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa",
                borderRadius: "4px",
              },
            }}
          />

          <Button variant="outlined" component="label">
            Upload Book Cover *
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
              required
            />
          </Button>

          {imagePreview && (
            <Box mt={2}>
              <img
                src={imagePreview}
                alt="Book Cover Preview"
                style={{
                  maxWidth: "50%",
                  maxHeight: "50px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}

          <TextField
            id="outlined-basic"
            label="PRICE (INR)"
            variant="outlined"
            type="text"
            value={value}
            onChange={handleValueChange}
            onBlur={handleBlur}
            placeholder="Enter Book Price"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            required
          />

          <div className="flex flex-row items-center space-x-2">
            {mediaProgress ? (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1F2937", minHeight: "55px" }}
                disabled
              >
                <CircularProgress size={24} color="inherit" />
              </Button>
            ) : (
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  fontSize: "0.75rem",
                  minWidth: "100px",
                  minHeight: "55px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  backgroundColor: "#1F2937",
                }}
              >
                Upload
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => generateFileUrlPath(event)}
                  required
                />
              </Button>
            )}

            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="No File Chosen"
              value={[filename]}
              disabled
              required
            />
          </div>

          {mediaProgress ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1F2937", minHeight: "55px" }}
              disabled
            >
              <CircularProgress size={24} color="inherit" />
              Uploading....
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1F2937", minHeight: "55px" }}
              onClick={submitBook}
            >
              PUBLISH BOOK
            </Button>
          )}
        </FormControl>
      </div>

      <div className="right-panel">
        {fileS3Path ? (
          <PdfViewer pdfUrl={fileS3Path} />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            width="100%"
            textAlign="center"
            sx={{ bgcolor: "#f9fafb" }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 80, color: "#9ca3af", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No PDF Preview Available
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default NewBook;
