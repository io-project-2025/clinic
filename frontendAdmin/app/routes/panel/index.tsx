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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TerminalIcon from "@mui/icons-material/Terminal";
import AssessmentIcon from "@mui/icons-material/Assessment";

const drawerWidth = 220;

const sidebarItems = [
  { text: "Użytkownicy", icon: <GroupIcon />, path: "" },
  { text: "Grafik", icon: <CalendarMonthIcon />, path: "timetable" },
  { text: "Konsola", icon: <TerminalIcon />, path: "console" },
  { text: "Statystyki", icon: <AssessmentIcon />, path: "stats" },
];

function PanelAppBar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "linear-gradient(90deg, #b71c1c 0%, #ff7043 100%)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Panel Administratora
        </Typography>
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
          background: "linear-gradient(180deg, #ffebee 0%, #ffcdd2 100%)",
          color: "#b71c1c",
        },
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={
                currentPath.startsWith("/panel") &&
                (item.path
                  ? currentPath.endsWith(item.path)
                  : currentPath === "/panel" || currentPath === "/panel/")
              }
              onClick={() => onNavigate(item.path)}
              sx={{
                "&.Mui-selected": {
                  background: "#e0e0e0", // bardziej neutralny kolor
                  color: "#b71c1c",
                  "& .MuiListItemIcon-root": { color: "#b71c1c" },
                },
              }}
            >
              <ListItemIcon sx={{ color: "#b71c1c" }}>{item.icon}</ListItemIcon>
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

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", height: "100vh" }}>
      <CssBaseline />
      <PanelAppBar />
      <PanelSidebar currentPath={location.pathname} onNavigate={navigate} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fff8f6",
          p: 3,
          pt: 10,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
