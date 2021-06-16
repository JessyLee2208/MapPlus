import React from 'react';
import styled from 'styled-components';

import { getDishData } from '../Utils/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { SubItemTitle } from './UIComponents/Typography';
import { deviceSize } from '../responsive/responsive';
import StarRender from '../Utils/StarRender';

const Menu = styled.div`
  display: grid;
  grid-template-columns: 80px 228px 90px;
  margin: 10px 15px 12px 18px;
  border: 1px solid #efefef;
  border-radius: 4px;
  align-items: center;
  // justify-content: space-between;
  background: #ffffff;
  cursor: pointer;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    display: flax;
  }
`;

const MenuInfo = styled.div`
  display: block;
  padding: 0px 4px 0 2px;
  flex-direction: column;

  flex-grow: 2;
  align-items: center;
`;

const RatingTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;

  padding-bottom: 4px;
`;

const SubTitle = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #185ee6;
  margin: 0;
  padding-bottom: 4px;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
`;

const MenuImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin: 10px;
  text-align: right;
  flex-shrink: 1;
  background: #f0f0f0;
  border: 0;

  flex-grow: 1;
  object-fit: cover;

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    width: 60px;
    height: 60px;
  }
`;

function SearchMenuCard(props) {
  const collectionCheck = useSelector((state) => state.collectionTitle);
  const dispatch = useDispatch();

  const star = StarRender(props.content.rating, { width: 16, height: 16 });

  function click(e) {
    getDishData(props.content.name).then((res) => {
      dispatch({
        type: 'setSelectedDish',
        data: res
      });
      dispatch({
        type: 'setCollectionTitle',
        data: false
      });
    });
    if (collectionCheck) {
      dispatch({
        type: 'setStoreData',
        data: []
      });
    }
  }

  return (
    <Menu onClick={click} id={props.content.name}>
      {props.content.imageUrl !== '' ? (
        <MenuImg src={props.content.imageUrl} alt="" id={props.content.name}></MenuImg>
      ) : (
        <MenuImg src="/onphoto.png" alt="" id={props.content.name}></MenuImg>
      )}

      <MenuInfo id={props.content.name}>
        <SubItemTitle id={props.content.name}>{props.content.name}</SubItemTitle>
        <SubTitle id={props.content.name}>NT.{props.content.price}</SubTitle>
      </MenuInfo>
      <Box style={{ flexDirection: 'column', paddingRight: '20px' }}>
        <Box style={{ justifyContent: 'center' }}>
          <RatingTitle style={{ textAlign: 'center' }} id={props.content.name}>
            {props.content.rating}
          </RatingTitle>
          <RatingTitle style={{ color: '#868686' }} id={props.content.name}>
            /5
          </RatingTitle>
        </Box>
        <RatingDiv id={props.content.name}>{star}</RatingDiv>
      </Box>
    </Menu>
  );
}

export default SearchMenuCard;
