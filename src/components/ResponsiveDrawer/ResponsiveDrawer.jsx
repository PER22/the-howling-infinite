import * as React from 'react';
import * as userService from '../../utilities/users-service'
import { Link } from 'react-router-dom';
import { useLoggedInUser } from '../LoggedInUserContext/LoggedInUserContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';


export default function ResponsiveDrawer() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  async function handleLogOut() {
    userService.logOut();
    setLoggedInUser(null);
  }

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  // True if screen width is greater than or equal to theme's md breakpoint
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  // Depending on screen width, set the drawer anchor to 'left' or 'top'
  const drawerAnchor = isMediumUp ? 'left' : 'top';

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event).key === 'Tab' ||
        (event).key === 'Shift')
    ) {
      return;
    }
    setOpen(open);
  };



  const list = () => (
    <List sx={{ backgroundColor: "#406150" }}>
      {[
        { name: 'Home', path: '/' },
        { name: 'The Howling Infinite', path: '/read' },
        { name: 'Side Essays', path: '/side-essays' },
        { name: 'Blog', path: '/blog' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ].map((item) => (
        <ListItem key={item.name} disablePadding>
          <ListItemButton component={Link} to={item.path} sx={{ textDecoration: "none" }} >
            <ListItemText primary={item.name} sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>
      ))}
      <Divider sx={{ backgroundColor: "white" }} />
      {loggedInUser?.isAdmin && <><ListItem disablePadding>
        <ListItemButton component={Link} to="/moderate">
          <ListItemText primary={"Moderate Comments"} sx={{ color: "white" }} />
        </ListItemButton>
      </ListItem>
        <Divider sx={{ backgroundColor: "white" }} /></>}
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/auth" onClick={loggedInUser ? handleLogOut : null}>
          <ListItemText primary={loggedInUser ? "Log Out" : "Log In"} sx={{ color: "white" }} />
        </ListItemButton>
      </ListItem>
    </List>
  );
  const getBorderRadiusStyle = (anchor) => {
    if (anchor === 'top') {
      return { borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' };
    } else if (anchor === 'left') {
      return { borderBottomRightRadius: '1rem' };
    }
    return {};
  }

  return (
    <div>
      <Button onClick={toggleDrawer(true)} sx={{ position: 'fixed', top: '1rem', left: '1rem', backgroundColor: "rgba(1,1,1,0.5)", zIndex: "10" }}><MenuIcon sx={{ color: 'white', }} /></Button>
      <Drawer
        anchor={drawerAnchor}
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { height: 'fit-content', ...getBorderRadiusStyle(drawerAnchor), border: "solid 3px grey"} }}
      >
        {list()}
      </Drawer>
    </div>
  );
}  
