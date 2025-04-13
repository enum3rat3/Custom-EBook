import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  deleteBook,
  getBookById,
  getMyBooks,
} from "../../Store/publisherReducer";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

const BookList = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const publisher = useSelector((state) => state.publisher);
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);
  // const startIndex = (page - 1) * itemsPerPage;
  // const currentItems = array.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleCardClick = (data) => {
    data = parseInt(data, 10);
    navigate(`/my-book/${data}`);
  };

  const handleDeleteBook = (data) => {
    try {
      dispatch(deleteBook({ jwt: keycloak.token, bookId: parseInt(data, 10) }));
      toast.success("book deleted successfully!!");
    } catch (error) {
      toast.error("error while deleting Book");
    }
  };

  useEffect(() => {
    try {
      dispatch(
        getMyBooks({ jwt: keycloak.token, email: keycloak?.tokenParsed.email })
      );
    } catch (error) {
      toast.error("internal server error!");
      navigate("/");
    }
  }, []);

  if (!initialized) {
    return <CustomLoadingPage />;
  }
  if (publisher.loading) {
    return <CustomLoadingPage />;
  }
  if (publisher.MyBooks && publisher.MyBooks.length > 0) {
    const startIndex = (page - 1) * itemsPerPage;
    const currentBooks = publisher.MyBooks.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <div className="flex justify-center min-h-screen overflow-y-auto ">
        <div className="flex flex-col justify-between">
          {" "}
          <div className="m-3 grid grid-cols-4">
            {currentBooks.map((data, idx) => (
              <Card
                sx={{
                  width: 300,
                  height: 320,
                  margin: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                  },
                }}
                key={idx}
              >
                <CardMedia
                  sx={{ height: 160 }}
                  image={data.bkS3CoverImagePath}
                  title={data.bkName + "_cover_image"}
                  onClick={() => handleCardClick(data.bid)}
                />
                <CardContent onClick={() => handleCardClick(data.bid)}>
                  <Typography gutterBottom variant="h6" component="div">
                    {data.bkName}
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
                    {data.bkDesc}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price:</span>
                    <span>{data.bookPrice + " Rs."}</span>
                  </div>

                  <Button
                    size="small"
                    onClick={() => handleDeleteBook(data.bid)}
                    sx={{
                      color: "red",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "darkred",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
          <div className="flex justify-center p-4">            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(publisher.MyBooks.length / itemsPerPage)}
                variant="outlined"
                color="primary"
                onChange={handlePageChange}
                page={page}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#1F2937",
                    borderColor: "#1F2937",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#1F2937",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#111827",
                    },
                  },
                }}
              />
            </Stack>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-[80vh] justify-center items-center">
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
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          No Book is Published Yet
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          You can start by Publishing New Book.
        </Typography>
      </Box>
    </div>
  );
};

export default BookList;
