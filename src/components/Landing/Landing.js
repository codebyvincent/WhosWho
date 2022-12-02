import styled from "styled-components";
import React, { useState } from "react";
import Arrow from "../Arrows/Arrow";
import Card from "../Card";

const FlexBox = styled.div`
  display: flex;
  gap: 20px;
`;

const Landing = (props) => {
  let decrementSongs = "";
  let incrementSongs = "";
  let decrementArtists = "";
  let incrementArtists = "";
  if (props.numSongs <= 1) {
    decrementSongs = "disabled";
  }
  if (props.numSongs === 3) {
    incrementSongs = "disabled";
  }
  if (props.numArtists <= 2) {
    decrementArtists = "disabled";
  }
  if (props.numArtists === 4) {
    incrementArtists = "disabled";
  }

  return (
    <div>
      <Card
        h="20%"
        w="100%"
        bg="#EEBEFA"
        b="1px solid black"
        br="10px"
        m="0 0 20px 0"
      >
        <FlexBox>
          <h1>Number Of Songs</h1>

          <Arrow
            symbol="back"
            handleClick={(event) =>
              decrementSongs === ""
                ? props.setNumSongs(props.numSongs - 1)
                : undefined
            }
            w="100px"
            visibility={decrementSongs}
          />

          <h2>{props.numSongs}</h2>
          <Arrow
            symbol="forward"
            handleClick={(event) =>
              incrementSongs === ""
                ? props.setNumSongs(props.numSongs + 1)
                : undefined
            }
          />
        </FlexBox>
      </Card>
      <Card
        h="20%"
        w="100%"
        bg="#EEBEFA"
        b="1px solid black"
        br="10px"
        m="0 0 20px 0"
      >
        <FlexBox>
          <h1>Number Of Artists</h1>
          <Arrow
            symbol="back"
            handleClick={(event) =>
              decrementArtists === ""
                ? props.setNumArtists(props.numArtists - 1)
                : undefined
            }
          />
          <h2>{props.numArtists}</h2>
          <Arrow
            symbol="forward"
            handleClick={(event) =>
              incrementArtists === ""
                ? props.setNumArtists(props.numArtists + 1)
                : undefined
            }
          />
        </FlexBox>
      </Card>
    </div>
  );
};

export default Landing;
