import {useEffect} from 'react'
import { Outlet, useNavigate, useLocation, Link as RouterLink } from "react-router";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import ScienceIcon from "@mui/icons-material/Science";
import DescriptionIcon from "@mui/icons-material/Description";

const drawerWidth = 220;

const sidebarItems = [
    {text: "Umów wizytę", icon: <EventIcon />, path: "umow-wizyte"},
    { text: "Twoje Wizyty", icon: <CalendarMonthIcon />, path: "wizyty" },
    { text: "Twoje Badania", icon: <ScienceIcon />, path: "badania" },
    { text: "Twoje Dokumenty", icon: <DescriptionIcon />, path: "dokumenty" },

];

function PanelAppBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("user")
    localStorage.removeItem("id");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "primary.main",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 1 }}
          component={RouterLink}
          to="/panel/"
          aria-label="Panel główny"
        >
          <HomeIcon />
        </IconButton>
        <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
          <SettingsIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Panel Pacjenta
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2 }}
            aria-label="Wyloguj się"
          >
            <Typography variant="button" sx={{ fontWeight: 600 }}>
              Wyloguj
            </Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function PanelSidebar({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          mt: 8,
        },
      }}
    >
      
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={currentPath.endsWith(item.path)}
              onClick={() => onNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default function PanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();
    

  useEffect(() => {
    // Sprawdzenie czy użytkownik jest zalogowany
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      // Jeśli użytkownik jest zalogowany, sprawdź czy ma ID
      const id = localStorage.getItem("id");
      if (!id) {
        navigate("/login");
      }
    }
  }, [])

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", height: "100vh" }}>
      <CssBaseline />
      <PanelAppBar />
      <PanelSidebar currentPath={location.pathname} onNavigate={navigate} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          pt: 10, 
          ml: `${drawerWidth}px`,
          overflow: "auto", 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
