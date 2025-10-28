import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface GridProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const GridContainer: React.FC<GridProps> = ({ children, sx }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)'
      },
      ...sx
    }}
  >
    {children}
  </Box>
);

export const GridItem: React.FC<GridProps> = ({ children, sx }) => (
  <Box sx={{ ...sx }}>{children}</Box>
);