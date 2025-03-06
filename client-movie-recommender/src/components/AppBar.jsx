import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ButtonAppBar() {

  return (
    <Box sx={{ 
        flexGrow: 1,
        '& .MuiAppBar-root': {
            backgroundColor: 'inherit',
        }
        
        }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="p" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Movie Recommender System
          </Typography>
          <Button color="inherit">YOGESH</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
