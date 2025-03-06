import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function MovieCard(props) {
    const { imageSrc, title } = props;
    return (
        <Box sx={{ display: 'inline-block' }}>
            <Box>
                <img
                    height="250"
                    src={`https://image.tmdb.org/t/p/w500${imageSrc}`}
                    alt={title}
                    style={{
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                />
            </Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: '600' }}>
                {title}
            </Typography>
        </Box>
    );
}
