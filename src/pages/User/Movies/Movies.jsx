import React, { useState } from 'react';
import MovieCard from '../../../components/MovieCard/MovieCard';
import { MOVIE_GENRES } from '../../../utils/constants';
import movies from '../../../data/movies.json';
import './Movies.css';

const Movies = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const filteredMovies = movies.filter(movie => {
    const matchTitle = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre ? movie.genre === genre : true;
    return matchTitle && matchGenre;
  });

  return (
    <div className="movies-page container">
      <h2 className="movies-title">Danh sách phim</h2>
      <div className="movies-filter">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">Tất cả thể loại</option>
          {MOVIE_GENRES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="movies-grid">
        {filteredMovies.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%' }}>Không tìm thấy phim phù hợp.</div>
        ) : (
          filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default Movies; 