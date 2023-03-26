import { PropsWithChildren, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

// styles
import { AppBar, DrawerHeader, drawerWidth, Main, styLink } from "./styles";
import { getLocalStorage, setLocalStorage } from "@/helpers/localStorage";
import { useRouter } from "next/router";

const MENUS = [
  {
    label: "Account",
    icon: <ManageAccountsIcon />,
    link: "/",
  },
  {
    label: "Product",
    icon: <InventoryIcon />,
    link: "/product",
  },
  {
    label: "Transaction",
    icon: <PointOfSaleIcon />,
    link: "/transaction",
  },
];

export default function PersistentDrawerLeft({
  children,
}: PropsWithChildren<unknown>) {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const isOpen = Boolean(getLocalStorage("openDrawer"));
    setOpen(isOpen);
  }, []);

  const handleDrawerOpen = () => {
    setLocalStorage("openDrawer", "true");
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setLocalStorage("openDrawer", "");
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Pazarin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {MENUS.map((menu) => (
            <Box
              key={menu.label}
              sx={styLink}
              className={router.pathname === menu.link ? "active" : ""}
            >
              <Link href={menu.link}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{menu.icon}</ListItemIcon>
                    <ListItemText primary={menu.label} />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Box>
          ))}
        </List>
        <Divider />
        <List>
          {["Setting"].map((text) => (
            <Box
              key={text}
              sx={styLink}
              className={router.pathname === "/setting" ? "active" : ""}
            >
              <Link href="/setting">
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Box>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
