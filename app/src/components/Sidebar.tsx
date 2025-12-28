import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';

const drawerWidth = 240;

interface SidebarProps {
  menuItems: string[];
  selectedItem: string;
  onSelectItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, selectedItem, onSelectItem }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              selected={selectedItem === item}
              onClick={() => onSelectItem(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
