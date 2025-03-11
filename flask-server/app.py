#!/usr/bin/env python
# coding: utf-8

import numpy as np
import pandas as pd
import ast
import copy

from flask import Flask, request, jsonify
from threading import Thread
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

movies = pd.read_csv('./assets/tmdb_5000_movies.csv')
movies.head(1)

credits = pd.read_csv('./assets/tmdb_5000_credits.csv')
credits.head(1)

# Merging both data frames

movies = movies.merge(credits, on='title')
movies.head(1)

# What to keep in the dataframe
# genres
# id
# keywords
# title
# overview
# cast
# crew

movies = movies[['id', 'genres', 'title', 'overview', 'keywords', 'cast', 'crew' ]]

movies.isnull().sum()

movies.dropna(inplace=True)
movies.isnull().sum()

movies.duplicated().sum()

movies.iloc[0].genres

def converter (obj):
    lst = []
    for i in ast.literal_eval(obj):
        lst.append(i['name'])
    return lst

movies.genres = movies['genres'].apply(converter)

movies.keywords = movies['keywords'].apply(converter)

def filter_movies(mvs, query):
    lst = []
    for mv in movies:   
        abc = mvs[query in mv[title]]
        lst.append(abc)
    return lst


@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies_data = copy.deepcopy(movies[[ 'id', 'title']])
    title = request.args.get('title').lower() # Get 'title' query param
    # Convert to a list of dictionaries
    movies_json = movies_data.to_dict(orient="records")
    filtered_movies = [movie for movie in movies_json if title in movie['title'].lower()]
    return jsonify({"movies": filtered_movies })


def castConverter (obj):
    lst = []
    counter = 0
    for i in ast.literal_eval(obj):
        if (counter < 3):
            lst.append(i['name'])
            counter += 1
        else:
            break
    return lst

movies.cast = movies['cast'].apply(castConverter)

def findDirector (obj):
    lst = []
    for i in ast.literal_eval(obj):
        if (i['job'] == 'Director'):
            lst.append(i['name'])
            break
    return lst

movies.crew = movies['crew'].apply(findDirector)
movies.head(1)

movies.overview = movies['overview'].apply(lambda x: x.split())
movies.head(1)

movies.genres = movies['genres'].apply(lambda x:[ i.replace(' ', '') for i in x])
movies.overview = movies['overview'].apply(lambda x:[ i.replace(' ', '') for i in x])
movies.keywords = movies['keywords'].apply(lambda x:[ i.replace(' ', '') for i in x])
movies.cast = movies['cast'].apply(lambda x:[ i.replace(' ', '') for i in x])
movies.crew = movies['crew'].apply(lambda x:[ i.replace(' ', '') for i in x])
movies.head(1)

movies['tags'] = movies['overview'] + movies['keywords'] + movies['genres'] + movies['cast'] + movies['crew']

# taking out only useful data
movies = movies[['id', 'title', 'tags']]
movies.head(1)

movies.tags = movies['tags'].apply(lambda x: " ".join(x))
movies.tags[0]

movies.tags = movies['tags'].apply(lambda x: x.lower())
movies.tags[0]


# ### Bag of Words Technique

from sklearn.feature_extraction.text import CountVectorizer

cv = CountVectorizer(stop_words='english', max_features=5000)

vectors = cv.fit_transform(movies['tags']).toarray()

import nltk
from nltk.stem.porter import PorterStemmer

stemmer = PorterStemmer()

def stemmerFunction(para):
    y = []
    for i in para.split():
        y.append(stemmer.stem(i))
    return " ".join(y)

movies.tags = movies['tags'].apply(stemmerFunction)

vectors = cv.fit_transform(movies['tags']).toarray()

from sklearn.metrics.pairwise import cosine_similarity

similarity = cosine_similarity(vectors)

def recommend(movie):
    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x:x[1])[1:6]
    # return movies_list
    movies_data = []
    for i in movies_list:
        movies_data.append({ 'id': movies.iloc[i[0]].id.item(), 'title': movies.iloc[i[0]].title })
    return movies_data

@app.route('/api/recommend', methods=['GET'])
def recommender():
    movie = request.args.get('title')
    if movie is None:
        return jsonify({"error": "Missing 'title' parameter"}), 400
    data = recommend(movie)
    return jsonify(data)

def run_flask():
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)

flask_thread = Thread(target=run_flask)
flask_thread.start()

