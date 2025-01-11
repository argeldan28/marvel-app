import './App.css';
import marvelLogo from './images/marvel-logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import md5 from 'md5';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [heroData, setHeroData] = useState(null);
  const [heroName, setHeroName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const publicKey = '804593e4eebe58ad1f6f3c4641c4ee76';
  const privateKey = '5e325b6f30258079f4468b3c64c44d0ac9cf331c';

  function generateHash(timestamp) {
    return md5(timestamp + privateKey + publicKey);
  }

  useEffect(() => {
    if (heroName.trim() === '') return;

    const fetchHeroData = async () => {
      setLoading(true);
      const timestamp = new Date().getTime();
      const hash = generateHash(timestamp);

      const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroName}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

      try {
        const res = await axios.get(apiUrl);
        if (res.data.data.results.length > 0) {
          setHeroData(res.data.data.results[0]);
          setError('');
        } else {
          setHeroData(null);
          setError('No heroes found.');
        }
      } catch (err) {
        setError('Error fetching data. Please try again.');
        setHeroData(null);
      }
      setLoading(false);
    };

    fetchHeroData();
  }, [heroName]);

  return (
    <main>
      <div className="logo">
        <img src={marvelLogo} alt="Marvel Logo" />
      </div>

      <div className="search">
        <input
          type="text"
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
          placeholder="Search your hero..."
        />
        <i className="bi bi-search"></i>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {heroData && (
        <div className="row">
          <div className="hero-info">
            <h2>{heroData.name}</h2>
            <p>{heroData.description || 'No description available.'}</p>
          </div>
          <div className="hero">
            <img
              src={`${heroData.thumbnail.path}.${heroData.thumbnail.extension}`}
              alt={heroData.name}
            />
            <p>{heroData.name}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
