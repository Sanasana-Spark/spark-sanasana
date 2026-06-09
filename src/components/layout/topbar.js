import React, { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/clerk-react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon,
  Tooltip,
  Divider,
  ListItemButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Settings from "@mui/icons-material/Settings";
import { useAuthContext } from "../onboarding/authProvider";
import Logout from "@mui/icons-material/Logout";

const TopBar = ({ onMenuClick, isMobile }) => {
  const TOP_NAV_ITEMS = [
    { path: '/',            label: 'Dashboard' },
    { path: '/assets',      label: 'Fleet' },
    { path: '/trips',       label: 'Trips' },
    { path: '/fuel',        label: 'Fuel' },
    { path: '/operators',   label: 'Drivers' },
    { path: '/maintenance', label: 'Maintenance' },
    { path: '/reports',     label: 'Reports' },
  ];

  const baseURL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { org_name, apiFetch } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(2);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isRouteActive = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);

  // State for notifications
const [notifAnchorEl, setNotifAnchorEl] = useState(null);
const notifOpen = Boolean(notifAnchorEl);

// State for account menu
const [accountAnchorEl, setAccountAnchorEl] = useState(null);
const accountOpen = Boolean(accountAnchorEl);

const handleClose = () => {
    setAccountAnchorEl(null);
};


const fetchNotifications = useCallback(async (status = "unread") => {
    try {
      const apiUrl = `${baseURL}/notifications/?status=${status}`;
       const response = await apiFetch(apiUrl, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  }, [apiFetch, baseURL]);


useEffect(() => {
    // initial fetch with all
    fetchNotifications("unread");
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
   []);

  // Tab switch fetches notifications from backend
  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    if (newValue === 0) fetchNotifications("all");
    if (newValue === 1) fetchNotifications("read");
    if (newValue === 2) fetchNotifications("unread");
  };

  // Update status
  const updateStatus = useCallback(async (notification_id, status) => {
    try {
      const apiUrl = `${baseURL}/notifications/update-status/`;
      await apiFetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({ notification_id: notification_id, status: status }),
      });
      // refresh current tab data
      if (tab === 0) fetchNotifications("all");
      if (tab === 1) fetchNotifications("read");
      if (tab === 2) fetchNotifications("unread");
    } catch (err) {
      console.error("Error updating status", err);
    }
  }, [apiFetch, tab, baseURL, fetchNotifications]);

  // Open notification dialog
  const handleOpenNotification = (notification) => {
    console.log("Opening notification:", notification);
    setSelectedNotification(notification);
    setDialogOpen(true);
    if (notification.read === false || notification.read === "false") {
      updateStatus(notification.id, "read");
    }
  };

  return (
  <header className="topbar">
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
        {isMobile && (
          <IconButton color="inherit" onClick={onMenuClick} sx={{ mr: 1, p: '4px', color: 'white' }}>
            <span style={{ fontSize: '20px' }}>☰</span>
          </IconButton>
        )}
        <span className="logo-badge">Spark</span>
        <span className="logo-name">Sanasana</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{org_name || 'Organization'}</span>
      </div>

      {!isMobile && (
        <nav className="top-nav">
          {TOP_NAV_ITEMS.map((n) => (
            <div
              key={n.path}
              className={`top-nav-item${isRouteActive(n.path) ? ' active' : ''}`}
              onClick={() => navigate(n.path)}
            >
              {isRouteActive(n.path) && <span className="top-nav-dot" />}
              {n.label}
            </div>
          ))}
        </nav>
      )}
    <div className="top-right">
        <div className="top-search">
          <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>⌕</span>
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <IconButton
          onClick={(e) => setNotifAnchorEl(e.currentTarget)}
          className="top-icon-btn"
          sx={{ border: 'none', borderRadius: '7px', width: 32, height: 32 }}
        >
          <Badge badgeContent={notifications.length} color="error" slotProps={{ badge: { className: 'notif-pip' } }}>
            <NotificationsIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
          </Badge>
        </IconButton>

        <div className="live-chip">
          <span className="live-dot" />
          <span className="live-label">LIVE</span>
        </div>

        {!isMobile && <UserButton afterSignOutUrl="/signin" />}
      </div>

      {/* Notifications Overlay Dropdown */}
      <Menu
        anchorEl={notifAnchorEl}
        open={notifOpen}
        onClose={() => setNotifAnchorEl(null)}
        slotProps={{ paper: { style: { width: 360, marginTop: '8px' } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="All" style={{ fontSize: '12px' }} />
          <Tab label="Read" style={{ fontSize: '12px' }} />
          <Tab label="Unread" style={{ fontSize: '12px' }} />
        </Tabs>
        <List sx={{ p: 0, maxHeight: 300, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <ListItem><ListItemText primary="No notifications" slotProps={{ primary: { style: { fontSize: 12.5, color: 'var(--ink3)' } } }} /></ListItem>
          ) : (
            notifications.map((n) => (
              <ListItem key={n.id} disablePadding divider>
                <ListItemButton onClick={() => { handleOpenNotification(n); setNotifAnchorEl(null); }}>
                  <ListItemText
                    primary={n.category || "Notification"}
                    secondary={n.message}
                    slotProps={{
                      primary: { style: { fontWeight: n.read === "false" || n.read === false ? "700" : "400", fontSize: 12.5 } },
                      secondary: { style: { fontSize: 11.5 } }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Menu>


      {/* Notification detail dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '15px' }}>
          {selectedNotification?.category || "Notification"}
        </DialogTitle>
        <DialogContent dividers >
          <p style={{ fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>{selectedNotification?.message}</p>
          {selectedNotification && (selectedNotification.read === true || selectedNotification.read === "true") && (
            <Button
              variant="outlined"
              size="small"
              onClick={() =>{ updateStatus(selectedNotification.id, "unread"); setDialogOpen(false); }}
              sx={{ textTransform: 'none', fontSize: '11.5px' }}
            >
              Mark as Unread
            </Button>
          )}
        </DialogContent>
      </Dialog>



  
  </header>
  );
};

export default TopBar;
