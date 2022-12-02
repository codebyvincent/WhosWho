import styled from "styled-components";
import React from "react";

const ArrowButton = styled.button`
  width: ${({ w }) => w};
  height: ${({ h }) => h};
  border: none;
  background: transparent;
  border-radius: 3px;
  color: #000;
  font-size: 30px;
  justify-content: space-between;
  &:disabled {
    background: #ccc;
    color: #555;
  }
  &: hover {
    cursor: pointer;
  }
`;

const ArrowSymbol = styled.div`
  border-radius: 10px;
  &: hover {
    background: #862e9c;
  }
`;

const Arrow = (props) => {
  let symbol = "";
  if (props.symbol === "back") {
    symbol = <ion-icon name="chevron-back-circle-outline"></ion-icon>;
  }
  if (props.symbol === "forward") {
    symbol = <ion-icon name="chevron-forward-circle-outline"></ion-icon>;
  }
  return (
    <ArrowButton className={props.visibility} onClick={props.handleClick}>
      <ArrowSymbol>{symbol}</ArrowSymbol>
    </ArrowButton>
  );
};

export default Arrow;
