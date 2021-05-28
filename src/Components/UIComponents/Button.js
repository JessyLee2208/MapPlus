import React from 'react';
import styled from 'styled-components';

const ButtonprimaryRound = styled.button`
  border: none;
  outline: none;

  background: #4285f4;
  color: #fff;

  padding: 0.3em 1.2em;
  font-size: 15px;
  border-radius: 25px;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:hover {
    background: #3075e8;
  }

  &:focus {
    outline: none;
  }
`;

const ButtonprimaryFlat = styled.button`
  border: none;
  outline: none;

  background: #4285f4;
  color: #fff;

  padding: 0.1em 1.2em;
  font-size: 15px;
  font-weight: bold;
  line-height: 36px;
  border-radius: 4px;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:hover {
    background: #3075e8;
  }

  &:focus {
    outline: none;
  }
`;

const ButtonsecondaryFlat = styled.button`
  border: none;
  outline: none;

  background: #fff;
  color: #4285f4;

  padding: 0.1em 1.2em;
  font-size: 15px;
  font-weight: bold;
  line-height: 36px;
  border-radius: 4px;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:hover {
    background: #f7f7f7;
  }

  &:focus {
    outline: none;
  }
`;

const ButtonghostRound = styled.button`
  border: none;
  outline: none;

  border: 1px solid #185ee6;
  background: #fff;
  color: #185ee6;

  padding: 0.3em 1.2em;
  font-size: 15px;
  border-radius: 25px;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:hover {
    background: #4285f4;
    border: 1px solid #4285f4;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

function ButtonPrimaryRound(props) {
  return (
    <ButtonprimaryRound onClick={props.onClick} style={props.style}>
      {props.children}
    </ButtonprimaryRound>
  );
}

function ButtonGhostRound(props) {
  return (
    <ButtonghostRound onClick={props.onClick} style={props.style}>
      {props.children}
    </ButtonghostRound>
  );
}

function ButtonPrimaryFlat(props) {
  return (
    <ButtonprimaryFlat onClick={props.onClick} style={props.style}>
      {props.children}
    </ButtonprimaryFlat>
  );
}
function ButtonSecondaryFlat(props) {
  return (
    <ButtonsecondaryFlat onClick={props.onClick} style={props.style}>
      {props.children}
    </ButtonsecondaryFlat>
  );
}

export {
  ButtonPrimaryRound,
  ButtonGhostRound,
  ButtonPrimaryFlat,
  ButtonSecondaryFlat
};
