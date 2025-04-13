import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useKeycloak } from "@react-keycloak/web";
import { toast } from "react-toastify";
import CustomLoadingPage from "../../Utils/CustomLoadingPage";
import { useNavigate } from "react-router";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Badge from '@mui/material/Badge';

const pages = ["Explore Books", "My Orders"];
const settings = ["Logout"];

const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    const text = event.target.innerText.trim().toUpperCase();

    if (text === "EXPLORE BOOKS") {
      navigate("/books");
    } else if (text === "MY ORDERS") {
      if (!keycloak?.authenticated) {
        navigate("/login");
      }
      navigate("/orders");
    }

    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event) => {
    const text = event.target.innerText;
    if (text === "Logout") {
      console.log("entered");
      keycloak.logout();
    }

    setAnchorElUser(null);
  };

  if (!initialized) {
    return <CustomLoadingPage />;
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1F2937" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AutoStoriesIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            E-BOOK
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      position: "relative",
                      "&:hover::after": {
                        content: "''", // Creates an empty content for the pseudo-element
                        position: "absolute",
                        bottom: -5, // Position the dot below the text
                        left: "50%", // Center it horizontally
                        transform: "translateX(-50%)", // Adjust for exact centering
                        width: 8, // Size of the dot
                        height: 8, // Size of the dot
                        borderRadius: "50%", // Make it round
                        backgroundColor: "red", // Color of the dot
                      },
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AutoStoriesIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            E-BOOK
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {keycloak?.authenticated ? (
              <>
                <Tooltip title="Cart">
                  <Badge badgeContent={3} color="primary" >
                    <LocalMallIcon  sx={{ fontSize: 38 }} />
                  </Badge>
                </Tooltip>
                <Tooltip title="Open Menu">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, color: "white" }}
                  >
                    <Avatar
                      alt={keycloak.tokenParsed?.given_name}
                      src="https://media.istockphoto.com/id/1012129712/vector/business-man-in-suit-abstract-comics-ink-drawing-isolated-vector-silhouette-people.jpg?s=612x612&w=0&k=20&c=njM5nRnrUgspXoAWJZH2NeiYuZlxn9KBCKPVec_qNcA="
                      sx={{ ml: 4 }}
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                sx={{ p: 0, color: "white" }}
                onClick={() => keycloak.login()}
              >
                {" "}
                Login{" "}
              </Button>
            )}

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={(e) => handleCloseUserMenu(e)}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
