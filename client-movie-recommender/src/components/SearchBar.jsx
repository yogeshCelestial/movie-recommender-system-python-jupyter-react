import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import debouncedRequest from '../utils/debouncer';
import { recommenderRequest } from '../utils/httpHelper';

export default function SearchBar(props) {
    const { setRecommendations } = props;

    const [typedText, setTypedText] = React.useState('');
    // State to store the selected value
    const [selectedMovie, setSelectedMovie] = React.useState({id: NaN, title: ''});
    const [fetchedMovies, setFetchedMovies] = React.useState([]);

    React.useEffect(() => {
        if (!typedText) {
            setFetchedMovies([]);
            setSelectedMovie({id: NaN, title: ''})
        }
    }, [typedText]);

    React.useEffect(() => {
        if (!selectedMovie?.title) {
            setFetchedMovies([]);
            setRecommendations([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMovie?.title]);

    // Handler for value change
    const handleMovieChange = (event, newValue) => {
        setSelectedMovie(newValue);
        recommenderRequest(newValue?.title, setRecommendations);
    };

    const textFieldHandler = (e) => {
        console.log(e.target.value, 'targeted Value');
        if (e.target.value) {
            debouncedRequest(e.target.value, setFetchedMovies)
        } else {
            setFetchedMovies([]);
        }
        setTypedText(e.target.value);
    }

    return (
        <Autocomplete
            disablePortal
            options={fetchedMovies}
            getOptionLabel={(option) => option.title}
            key={(option) => option.id}
            sx={{
                width: 300,
                '& .MuiOutlinedInput-root': {
                    color: 'white',
                },
                '& label': {
                    color: 'white'
                },
                '& svg': {
                    fill: 'white'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: "white",
                    borderRadius: '6px'
                }

            }}
            value={selectedMovie}
            onChange={handleMovieChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    value={typedText}
                    label="Start typing a movie title"
                    onChange={textFieldHandler}
                />
            )}
        />
    );
}