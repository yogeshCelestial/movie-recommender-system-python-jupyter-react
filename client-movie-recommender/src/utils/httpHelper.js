import.meta.API_KEY

const httpHelper = async (query, setterFunc) => {
    if (query) {
        const response = await fetch(`http://127.0.0.1:5000/api/movies?title=${query}`);
        const result = await response.json();
        if (result?.movies?.length) {
            setterFunc(JSON.parse(JSON.stringify(result.movies)));
        }
        else {
            setterFunc([])
        };
    } else return;

}

export const recommenderRequest = async (query, setterFunc) => {
    if (query) {
        const response = await fetch(`http://127.0.0.1:5000/api/recommend?title=${query}`);
        const result = await response.json();
        setterFunc(JSON.parse(JSON.stringify(result)) || []);
    } else return;

}

export const getMoviePoster = async (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
        }
    };

    const path = fetch(url, options)
        .then(res => res.json())
        .then(json => json?.poster_path)
        .catch(err => console.error(err));
    return path;
}

export default httpHelper;