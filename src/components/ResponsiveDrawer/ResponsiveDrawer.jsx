import * as React from 'react';
import * as userService from '../../utilities/users-service'
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider  from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
export default function ResponsiveDrawer({setUser, user}) {
    async function handleLogOut() {
      userService.logOut();
      setUser(null);
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
      <List>
      {[
        { name: 'Home', path: '/' },
        { name: 'The Howling Infinite', path: '/read' },
        { name: 'Side Essays', path: '/side-essays' },
        { name: 'Blog', path: '/blog' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ].map((item) => (
        <ListItem key={item.name} disablePadding>
          <ListItemButton component={Link} to={item.path}>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
      <Divider />
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/auth" onClick={user ? handleLogOut : null}>
          <ListItemText primary={user ? "Log Out" : "Log In"} />
        </ListItemButton>
      </ListItem>
    </List>
  );

    return (
      <div>
        <Button onClick={toggleDrawer(true)}><MenuIcon/></Button>
        <Drawer
          anchor={drawerAnchor}
          open={open}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </Drawer>
      </div>
    );
}
