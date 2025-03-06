import { Box, Typography } from '@mui/material'
import './App.css'
import ButtonAppBar from './components/AppBar'
import SearchBar from './components/SearchBar'
import React, { useEffect } from 'react';
import { getMoviePoster } from './utils/httpHelper';
import MovieCard from './components/Card';

function App() {
  const [recommendations, setRecommendations] = React.useState([]);
  const [posterPaths, setPosterPaths] = React.useState([]);

  useEffect(() => {
    async function fetchPoster(id) {
      const poster = await getMoviePoster(id);
      setPosterPaths((prev) => {
        return [
          ...prev,
          poster
        ]
      })
    }
    if (recommendations.length === 5) {
      recommendations.forEach((rec) => {
        fetchPoster(rec.id)
      })
    } else if (recommendations.length === 0) {
      setPosterPaths([]);
    }
  }, [recommendations])

  return (
    <>
      <div>
        <ButtonAppBar />
        <Box sx={{ margin: '20px 100px' }}>
          <Box>
            <Typography variant='h5' style={{ fontWeight: '700' }}>Select a movie</Typography>
            <SearchBar setRecommendations={setRecommendations} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
            {posterPaths.length ? posterPaths?.map((path, index) => (
              <MovieCard key={path} imageSrc={path} title={recommendations?.[index]?.title} />
            ))
              : <Typography marginTop='100px' variant='h5'>Type a movie name to get recommendations...</Typography>
            }
          </Box>
        </Box>
      </div>
    </>
  )
}

export default App
