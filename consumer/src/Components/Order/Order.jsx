import { useKeycloak } from "@react-keycloak/web";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import { viewOrders } from "../../Store/consumerReducer";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Stack,
  Pagination,
  Button,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
const Order = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const consumer = useSelector((state) => state.consumer);
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(
      viewOrders({ jwt: keycloak.token, email: keycloak?.tokenParsed.email })
    );
  }, []);

  if (!initialized) {
    return <CustomLoadingPage />;
  }

  if (consumer.loading) {
    return <CustomLoadingPage />;
  }

  if (consumer.MyBooks && consumer.MyBooks.length > 0) {
    const startIndex = (page - 1) * itemsPerPage;
    const currentBooks = consumer.MyBooks.slice(
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
                  image="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?cs=srgb&dl=pexels-pixabay-159866.jpg&fm=jpg"
                  title={data.bookName + "_cover_image"}
                  onClick={() => {}}
                />
                <CardContent className="flex flex-col justify-center ">
                  <Typography gutterBottom variant="h6" component="div">
                    {data.bookName}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h6" // Use a valid variant like h6 instead of h8
                    component="div"
                    style={{
                      color: "#ff7043", // Highlighted price color
                      fontWeight: "600", // Semi-bold text
                      fontSize: "20px", // Readable size
                      marginTop: "8px", // Some spacing from the top
                    }}
                  >
                    {"Price: " + data.bookPrice + " Rs."}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginLeft: 1,
                  }}
                >
                  <a
                    href={data.bookS3Path}
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
                </CardActions>
              </Card>
            ))}
          </div>
          <div className="flex justify-center p-4">
            {" "}
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(consumer.MyBooks.length / itemsPerPage)}
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
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <ShoppingBasketIcon
          sx={{ color: "#ff7043", marginBottom: "16px", fontSize: "120px" }} // Change 80px to any size
        />
        <Typography
          variant="h4"
          style={{
            color: "#555",
            fontWeight: "500",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          No Orders Made Yet
        </Typography>
        <Typography
          variant="body1"
          style={{
            color: "#888",
            fontSize: "16px",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          Start adding items to your cart and complete the order process to view
          your orders here.
        </Typography>
      </Box>
    </>
  );
};

export default Order;
