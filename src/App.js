import React, { useEffect, useState } from 'react';

const PlanetDetails = () => {
  const [planet, setPlanet] = useState(null);
  const [residentData, setResidentData] = useState([]);
  const [filmData, setFilmData] = useState([]);

  useEffect(() => {
    const fetchPlanet = async () => {
      const cachedData = localStorage.getItem('planetData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const { data, expiration } = parsedData;
        if (expiration > Date.now()) {
          setPlanet(data);
          fetchResidentData(data.residents);
          fetchFilmData(data.films);
          return;
        }
      }

      try {
        const response = await fetch('https://swapi.dev/api/planets/1/');
        if (response.ok) {
          const data = await response.json();
          setPlanet(data);
          const expiration = Date.now() + 24 * 60 * 60 * 1000;
          const cachedData = JSON.stringify({ data, expiration });
          localStorage.setItem('planetData', cachedData);

          fetchResidentData(data.residents);
          fetchFilmData(data.films);
        } else {
          console.error('Failed to fetch planet data');
        }
      } catch (error) {
        console.error('Error occurred while fetching planet data:', error);
      }
    };

    fetchPlanet();
  }, []);

  const fetchResidentData = async (residentUrls) => {
    const residents = await Promise.all(
      residentUrls.map(async (url) => {
          const response = await fetch(url);
            const residentData = await response.json();
            return residentData;
      })
    );

    setResidentData(residents);
  };

  const fetchFilmData = async (filmUrls) => {
    const films = await Promise.all(
      filmUrls.map(async (url) => {
          const response = await fetch(url);
            const filmData = await response.json();
            return filmData;
      })
    );

    setFilmData(films);
  };

  return (
    <div>
      {planet ? (
        <div>
          <h1>Name: {planet.name}</h1>
          <p>Rotation Period: {planet.rotation_period}</p>
          <p>Orbital period: {planet.orbital_period}</p>
          <p>Diameter: {planet.diameter}</p>
          <p>Climate: {planet.climate}</p>
          <p>Gravity: {planet.gravity}</p>
          <p>Terrain: {planet.terrain}</p>
          <p>Surface Water: {planet.surface_water}</p>
          <p>Population: {planet.population}</p>

            <div>
              <h2>Residents:</h2>
              <ul>
                {residentData.map((resident, index) => (
                  <li key={index}>{resident ? resident.name : 'Unknown Resident'}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Films:</h2>
              <ul>
                {filmData.map((film, index) => (
                  <li key={index}>{film ? film.title : 'Unknown Film'}</li>
                ))}
              </ul>
            </div>
        </div>
      ) : (
        <p>Loading planet data...</p>
      )}
    </div>
  );
};

export default PlanetDetails;

