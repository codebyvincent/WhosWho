import styled from "styled-components";
import React, { useState } from "react";
import Card from "../Card";
import Howler from "react-howler-player";

const SubmitButton = styled.button`
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

const PlayButton = styled.button`
  height: max-content;
  width: max-content;
  font-size: 5em;
  margin: 0 auto;
  background: transparent;
  border: none;
  &: hover {
    cursor: pointer;
  }
`;

const PlayButtonContainer = styled.div`
  margin: 0 auto;
  height: max-content;
  width: max-content;
  margin-bottom: 10px;
`;

const CheckBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  font-size: 2em;
  align-items: center;
  > input {
    height: 20px;
    width: 20px;
  }
`;

const GameFlexBox = styled.div`
  display: flex;
  gap: 20px;

  justify-content: center;
`;

const ReturnButton = styled.button`
  margin-top: 30px;
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
  font-size: 2em;
  background: #bac8ff;

  &: hover {
    cursor: pointer;
    background: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
  }
`;

const Game = (props) => {
  const {
    artists,
    song,
    songs,
    artist,
    playAgain,
    reset,
    highScore,
    updateHighScore,
  } = props;
  console.log("Song:", song);
  const [score, setScore] = useState(0);

  const [lives, setLives] = useState([0, 1, 2]);
  //   const artistArray = props.artists;
  //   const inputs = artistArray.map((key, artist) => {
  //     artist.name;
  //   });

  const handleUserAnswer = () => {
    let artistInputs = document.getElementsByClassName("artistCheckbox");
    let songInputs = document.getElementsByClassName("songCheckbox");

    let userArtistChoice = undefined;
    let userSongChoice = undefined;

    for (let i = 0; i < artistInputs.length; i++) {
      if (artistInputs[i].checked === true) {
        userArtistChoice = artistInputs[i];
      }
    }

    for (let i = 0; i < songInputs.length; i++) {
      if (songInputs[i].checked === true) {
        userSongChoice = songInputs[i];
      }
    }
    console.log(userArtistChoice);
    console.log(userSongChoice);
    console.log(artist);
    console.log(song);
    if (artist === userArtistChoice.id && song.name === userSongChoice.id) {
      let newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        updateHighScore(newScore);
      }
    } else {
      setLives(lives.slice(0, -1));
      if (lives.slice(0, -1).length === 0) {
        disableEverything(songInputs, artistInputs);
      }

      console.log(lives);
    }
    reset();
  };

  const disableEverything = (songInputs, artistInputs) => {
    let submit = document.getElementById("submit");
    submit.disabled = true;
    for (let i = 0; i < songInputs.length; i++) {
      songInputs[i].disabled = true;
    }
    for (let i = 0; i < artistInputs.length; i++) {
      artistInputs[i].disabled = true;
    }
  };

  const disableOtherArtists = (event) => {
    console.log(event.target);
    let artistInputs = document.getElementsByClassName("artistCheckbox");
    for (let i = 0; i < artistInputs.length; i++) {
      if (event.target.checked === true) {
        if (artistInputs[i] !== event.target) {
          artistInputs[i].disabled = true;
        }
      } else {
        if (artistInputs[i] !== event.target) {
          artistInputs[i].disabled = false;
        }
      }
    }
  };

  const disableOtherSongs = (event) => {
    let songInputs = document.getElementsByClassName("songCheckbox");
    for (let i = 0; i < songInputs.length; i++) {
      if (event.target.checked === true) {
        if (songInputs[i] !== event.target) {
          songInputs[i].disabled = true;
        }
      } else {
        if (songInputs[i] !== event.target) {
          songInputs[i].disabled = false;
        }
      }
    }
  };

  return (
    <div className="game">
      {song ? <Howler src={song.preview_url} /> : <></>}

      <Card
        h="40%"
        w="100%"
        bg="#EEBEFA"
        b="1px solid black"
        br="10px"
        m="0 0 20px 0 "
      >
        <div>
          <GameFlexBox>
            <h1>Which Artist is it?</h1>
          </GameFlexBox>
          {artists.map((artist) => (
            <CheckBox>
              <input
                type="checkbox"
                key={artist.id}
                id={artist.name}
                className="artistCheckbox"
                onClick={disableOtherArtists}
              />
              <p>{artist.name}</p>
            </CheckBox>
          ))}
        </div>
        <div>
          <GameFlexBox>
            <h1>Which Song is it?</h1>
          </GameFlexBox>
          {songs.map((song) => (
            <CheckBox>
              <input
                type="checkbox"
                id={song.name}
                key={song.id}
                className="songCheckbox"
                onClick={disableOtherSongs}
              />
              <p>{song.name}</p>
            </CheckBox>
          ))}
        </div>
      </Card>
      <SubmitButton onClick={handleUserAnswer} id="submit">
        Submit
      </SubmitButton>

      <Card h="20%" w="100%" b="1px solid black">
        <GameFlexBox>
          <div>
            <h3>Lives</h3>
            {lives.length === 0 ? (
              <h3>Game Over</h3>
            ) : (
              lives.map((live) => <ion-icon name="heart" key={live}></ion-icon>)
            )}
          </div>

          <div>
            <h2>Score: {score}</h2>
            <h2>High Score: {highScore}</h2>
          </div>
        </GameFlexBox>
      </Card>
      {lives.length === 0 && (
        <ReturnButton onClick={playAgain}>Play Again?</ReturnButton>
      )}
    </div>
  );
};

export default Game;
