import React from 'react';
import styled from 'styled-components';
import { deviceSize } from '../../properties/properties';

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

const ButtondisableFlat = styled.button`
  border: none;
  outline: none;

  background: #d6d6d6;
  color: #a5a5a5;

  padding: 0.1em 1.2em;
  font-size: 15px;
  font-weight: bold;
  line-height: 36px;
  border-radius: 4px;

  cursor: not-allowed;
  // transition: all 150ms ease-in-out;

  &:focus {
    outline: none;
  }
`;

const ButtonprimaryRound = styled.button`
  border: none;
  outline: none;

  background: #4285f4;
  color: #fff;

  padding: 0.5em 1.2em;
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

  z-index: ${({ zIndex }) => (zIndex ? zIndex : 1)};

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    font-size: 13px;
    padding: 0.3em 1em;
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
  margin: ${({ margin }) => (margin ? margin : 0)};
  @media screen and (max-width: ${deviceSize.mobileS}px) {
    font-size: 13px;
    padding: 0.3em 1em;
  }
`;

const ButtonghostRoundWithIcon = styled.button`
  border: none;
  outline: none;
  // width: 140px;

  border: 1px solid #d1d4d9;
  background: #fff;
  color: #black;

  padding: 0.5em 0.9em;
  font-size: 15px;
  border-radius: 25px;

  display: flex;
  align-items: center;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  margin: ${({ margin }) => (margin ? margin : 0)};

  &:hover {
    background: #eef0f1;
  }

  &:focus {
    outline: none;
  }
  @media screen and (max-width: ${deviceSize.mobileS}px) {
    font-size: 13px;
    padding: 0.3em 1em;
  }

  img {
    width: 14px;
    margin-left: 4px;
  }
`;

const ButtongprimaryRoundWithIcon = styled.button`
  border: none;
  outline: none;

  background: #4285f4;
  color: #fff;

  padding: 0.6em 1.2em;
  font-size: 15px;
  border-radius: 25px;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  font-size: 15px;
  border-radius: 25px;

  display: flex;
  align-items: center;

  cursor: pointer;
  transition: all 150ms ease-in-out;

  margin: ${({ margin }) => (margin ? margin : 0)};
  z-index: ${({ zIndex }) => (zIndex ? zIndex : 1)};

  &:focus {
    outline: none;
  }
  @media screen and (max-width: ${deviceSize.mobileS}px) {
    font-size: 13px;
    padding: 0.3em 1em;
  }

  img {
    width: 14px;
    margin-left: 4px;
  }
`;

function ButtonPrimaryRound(props) {
  const { zIndex } = props;
  return (
    <ButtonprimaryRound onClick={props.onClick} style={props.style} zIndex={zIndex} data-testid="primaryRoundButton">
      {props.children}
    </ButtonprimaryRound>
  );
}

function ButtonGhostRound(props) {
  const { margin } = props;
  return (
    <ButtonghostRound onClick={props.onClick} style={props.style} margin={margin}>
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

function ButtonDisableFlat(props) {
  return (
    <ButtondisableFlat onClick={props.onClick} style={props.style}>
      {props.children}
    </ButtondisableFlat>
  );
}

function ButtonGhostRoundIcon(props) {
  const { src, margin } = props;
  return (
    <ButtonghostRoundWithIcon onClick={props.onClick} style={props.style} margin={margin}>
      {props.children}
      <img src={src} alt=""></img>
    </ButtonghostRoundWithIcon>
  );
}

function ButtonPrimaryRoundIcon(props) {
  const { src, margin, zIndex } = props;
  return (
    <ButtongprimaryRoundWithIcon onClick={props.onClick} style={props.style} margin={margin} zIndex={zIndex}>
      {props.children}
      <img src={src} alt=""></img>
    </ButtongprimaryRoundWithIcon>
  );
}

export {
  ButtonPrimaryRound,
  ButtonGhostRound,
  ButtonPrimaryFlat,
  ButtonSecondaryFlat,
  ButtonDisableFlat,
  ButtonGhostRoundIcon,
  ButtonPrimaryRoundIcon
};
