import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import fetchFromSpotify, { request } from "../services/api";
import Landing from "./Landing/Landing";
import Game from "./Game/Game";
import Card from "./Card";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const FlexBox = styled.div`
  display: flex;
  gap: 20px;
  font-size: 2em;
  font-weight: bold;

  > select {
    width: 20em;
  }
`;
const SubmitButton = styled.input`
  height: 20%;
  font-size: 2em;
  background: #bac8ff;
  border: 1px solid black;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 30px;

  &: hover {
    cursor: pointer;
    background: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
  }
`;

const Title = styled.button`
  border: none;
  background: transparent;
  font-size: 2.5em;
  font-weight: 500;
  margin-bottom: 20px;

  &: hover {
    color: gray;
    cursor: pointer;
  }
`;

const Home = () => {
  const [genres, setGenres] = useState([]); //1
  const [selectedGenre, setSelectedGenre] = useState(""); //2
  const [authLoading, setAuthLoading] = useState(false); //3
  const [configLoading, setConfigLoading] = useState(false); //4
  const [token, setToken] = useState(""); //5
  const [numberOfSongs, setNumberOfSongs] = useState(1); //6
  const [numberOfArtists, setNumberOfArtists] = useState(2); //7
  const [artists, setArtists] = useState([]); //8
  const [selectedArtist, setSelectedArtist] = useState(""); //9
  const [songs, setSongs] = useState([]); //10
  const [selectedSong, setSelectedSong] = useState(); //11
  const [highScore, setHighScore] = useState(0);
  const [playGame, setPlayGame] = useState(false);
  const [error, setError] = useState(false);
  const [errorLabel, setErrorLabel] = useState("");

  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    setGenres(response.genres);
    setConfigLoading(false);
  };

  const searchArtists = async (event) => {
    const response = await fetchFromSpotify({
      token: token,
      endpoint: `search`,
      params: {
        q: `genre:"${selectedGenre}"`,
        type: "artist",
      },
    });
    console.log(response);
    let responseArray = response.artists.items;
    if (responseArray.length === 0) {
      setError(true);
      setErrorLabel("There are no artists in this genre please choose another");
    } else if (numberOfArtists > responseArray.length) {
      setError(true);
      setErrorLabel("There are not enough artists in this genre");
    } else {
      let artistChoices = [];
      for (let i = 0; i < numberOfArtists; i++) {
        let index = Math.floor(Math.random() * responseArray.length);
        artistChoices.push(responseArray[index]);
        responseArray.splice(index, 1);
      }
      let index = Math.floor(Math.random() * artistChoices.length);
      setSelectedArtist(artistChoices[index].name);
      searchSong(artistChoices[index].name);
      setArtists(artistChoices);
      setPlayGame(true);
      setError(false);
    }
  };

  const returnToHome = () => {
    setPlayGame(false);
  };

  const searchSong = async (artist) => {
    const response = await fetchFromSpotify({
      token: token,
      endpoint: "search",
      params: {
        q: `artist:${artist}`,
        type: "track",
      },
    });
    console.log(response);
    let responseArray = response.tracks.items;
    let songChoices = [];
    let songsToBeAdded = numberOfSongs;
    for (let i = 0; i < responseArray.length; i++) {
      let index = Math.floor(Math.random() * responseArray.length);
      if (responseArray[index].preview_url !== null) {
        songsToBeAdded = songsToBeAdded - 1;
        songChoices.push(responseArray[index]);
      }
      if (songsToBeAdded === 0) {
        break;
      }
      responseArray.splice(index, 1);
    }
    let index = Math.floor(Math.random() * songChoices.length);
    setSelectedSong(songChoices[index]);
    setSongs(songChoices);
  };

  useEffect(() => {
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, []);

  if (authLoading || configLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <Title onClick={returnToHome}>Who's Who</Title>

      {!playGame && (
        <Fragment>
          <Landing
            numArtists={numberOfArtists}
            numSongs={numberOfSongs}
            setNumSongs={setNumberOfSongs}
            setNumArtists={setNumberOfArtists}
            highScore={highScore}
          />
          <Card
            h="20%"
            w="100%"
            bg="#EEBEFA"
            b="1px solid black"
            br="10px"
            m="0 0 20px 0"
          >
            <FlexBox>
              Genre:
              <select
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
              >
                <option value="" />
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </FlexBox>
          </Card>
          <SubmitButton type="submit" value="Play" onClick={searchArtists} />
          {error && <label>{errorLabel}</label>}
          <Card h="20%" w="100%" b="1px solid black">
            <div>
              <h2>High Score: {highScore}</h2>
            </div>
          </Card>
        </Fragment>
      )}

      {playGame && (
        <Game
          artistChoices={numberOfArtists}
          artists={artists}
          artist={selectedArtist}
          song={selectedSong}
          songs={songs}
          highScore={highScore}
          updateHighScore={setHighScore}
          reset={searchArtists}
          playAgain={returnToHome}
        />
      )}
    </Fragment>
  );
};

export default Home;
