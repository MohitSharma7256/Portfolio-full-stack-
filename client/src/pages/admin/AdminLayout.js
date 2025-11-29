import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Code as CodeIcon,
  Description as ResumeIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Build as BuildIcon,
  WorkHistory as WorkIcon,
  School as SchoolIcon,
  Share as ShareIcon,
  Mail as MailIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Profile', icon: <ProfileIcon />, path: '/admin/profile' },
    { label: 'Projects', icon: <CodeIcon />, path: '/admin/projects' },
    { label: 'Skills', icon: <BuildIcon />, path: '/admin/skills' },
    { label: 'Experience', icon: <WorkIcon />, path: '/admin/experience' },
    { label: 'Education', icon: <SchoolIcon />, path: '/admin/education' },
    { label: 'Social Links', icon: <ShareIcon />, path: '/admin/social' },
    { label: 'Messages', icon: <MailIcon />, path: '/admin/messages' },
    { label: 'Resume', icon: <ResumeIcon />, path: '/admin/resume' }
  ];

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          fullWidth
          startIcon={item.icon}
          onClick={() => isMobile && setMobileOpen(false)}
          sx={{
            justifyContent: 'flex-start',
            color: isActive(item.path) ? 'primary.main' : 'text.secondary',
            backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
            '&:hover': {
              backgroundColor: isActive(item.path) ? 'action.selected' : 'action.hover',
            },
            borderRadius: 2,
            px: 2,
            py: 1.5,
            textTransform: 'none',
            fontWeight: isActive(item.path) ? 600 : 400
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
          <div>
            <Button
              onClick={handleMenu}
              color="inherit"
              startIcon={
                <Avatar
                  sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
                />
              }
            >
              Admin
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem component={Link} to="/admin/profile" onClick={handleClose}>
                <ProfileIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              pt: 8
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{
            width: 240,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            pt: 8,
            overflowY: 'auto'
          }}
        >
          {drawerContent}
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          ml: { xs: 0, md: '240px' },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          width: { xs: '100%', md: 'calc(100% - 240px)' }
        }}
      >
        <Container maxWidth="lg" sx={{ pb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;