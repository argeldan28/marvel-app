import './App.css'
import marvelLogo from './images/marvel-logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import md5 from 'md5';
import React, { useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  
  const [heroData, setHeroData] = useState(null);
  const [heroName, setHeroName] = useState('');
  const [error, setError] = useState('');

  const publicKey = '804593e4eebe58ad1f6f3c4641c4ee76';
  const privatekey = '5e325b6f30258079f4468b3c64c44d0ac9cf331c';

  function generateHash(timestamp) {
    return md5(timestamp + privatekey + publicKey)
  };

  useEffect(() => {
    if (heroName.trim() === '') return;

    const timestamp = new Date().getTime() / 1000;
    const hash = generateHash(timestamp);

    const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${heroName}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

    const fetchHeroData = async () => {
      try {
        const res = await axios.get(apiUrl);
        setHeroData(res.data.data.results[0]);
        setError('');
      } catch (error) {
        setError("Errore nel recupero dei dati.", error.message);
        setHeroData(null);
      }
    };

    fetchHeroData();

    
  },[heroName]);

  
    const handleHeroChange = (e) => {
      setHeroName(e.target.value);
    }

  return (
    <>
      <div>
        <div className='logo'>
          <img src={marvelLogo} alt="" />
        </div>

        <div className='search'>
          <input type="text" value={heroName} onChange={handleHeroChange} placeholder='Search your hero...' />
          <i className="bi bi-search"></i>
        </div>
        {heroData ? (
          <div className='row'>
        
          {error && <p>{error}</p>}


          <div className='hero-info'>
            <h2>{heroData.name}</h2>
            <p>{heroData.description || 'No description available'}</p>
          </div>

          <div className='hero'>
              <img src={`${heroData.thumbnail.path}.${heroData.thumbnail.extension}`} alt="Hero Image" />
              <p>{heroData.name}</p>
          </div>

        </div>
        )
          : ( <p>Start by searching for a hero!</p> )
        }
      </div>
        
    
    </>
  )
}

export default App
