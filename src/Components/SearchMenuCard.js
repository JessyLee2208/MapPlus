import React from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';
import { getDishData } from '../Utils/firebase';
import { useDispatch } from 'react-redux';
import { ItemTitle, SubItemTitle } from './UIComponents/Typography';
import { deviceSize } from '../responsive/responsive';

const menu = {
  imageUrl: 'https://d1ralsognjng37.cloudfront.net/9fd74208-c3ad-4c23-b086-d60f4cdf7704',
  name: '羊肉漢堡 Lamb Feta Burger',
  objectID: 'q6IotJzmP5wYK1jOwkXS',
  price: 300,
  rating: 0,
  storeCollectionID: 'ChIJNTAArY-pQjQR0G-DgiWp9dc',
  storeName: 'KGB Kiwi Gourmet Burgers',
  user_ratings_total: 0
};

const Menu = styled.div`
  display: grid;
  grid-template-columns: 80px 228px 90px;
  margin: 10px 15px 12px 18px;
  border: 1px solid #efefef;
  border-radius: 4px;
  align-items: center;
  // justify-content: space-between;

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

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    width: 60px;
    height: 60px;
  }
`;

const NoImg = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin: 10px;
  text-align: right;
  flex-shrink: 1;
  background: #f0f0f0;

  flex-grow: 1;

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    width: 50px;
    height: 50px;
  }
`;

function SearchMenuCard(props) {
  const dispatch = useDispatch();
  let starArry = [];

  renderStar(props.content.rating, starArry);

  function click(e) {
    getDishData(props.content.name).then((res) => {
      console.log(res);
      dispatch({
        type: 'setSelectedDish',
        data: res
      });
      dispatch({
        type: 'setCollectionTitle',
        data: false
      });
    });
  }

  return (
    <Menu onClick={click}>
      {/* <Box> */}
      {props.content.imageUrl !== '' ? (
        <MenuImg src={props.content.imageUrl} alt=""></MenuImg>
      ) : (
        <MenuImg src="/onphoto.png" alt=""></MenuImg>
      )}

      <MenuInfo>
        <SubItemTitle>{props.content.name}</SubItemTitle>
        <SubTitle>NT.{props.content.price}</SubTitle>
      </MenuInfo>
      {/* </Box> */}
      <Box style={{ flexDirection: 'column', paddingRight: '20px' }}>
        <Box style={{ justifyContent: 'center' }}>
          <RatingTitle style={{ textAlign: 'center' }}>{props.content.rating}</RatingTitle>
          <RatingTitle style={{ color: '#868686' }}>/5</RatingTitle>
        </Box>
        <RatingDiv>{starArry}</RatingDiv>
      </Box>
    </Menu>
  );
}

export default SearchMenuCard;
