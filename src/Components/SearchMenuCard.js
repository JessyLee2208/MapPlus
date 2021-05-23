import React from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';

const menu = {
  imageUrl:
    'https://d1ralsognjng37.cloudfront.net/9fd74208-c3ad-4c23-b086-d60f4cdf7704',
  name: '羊肉漢堡 Lamb Feta Burger',
  objectID: 'q6IotJzmP5wYK1jOwkXS',
  price: 300,
  rating: 0,
  storeCollectionID: 'ChIJNTAArY-pQjQR0G-DgiWp9dc',
  storeName: 'KGB Kiwi Gourmet Burgers',
  user_ratings_total: 0
};

const Menu = styled.div`
  display: flex;
  margin: 10px 15px 12px 18px;
  border: 1px solid #efefef;
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
`;

const MenuInfo = styled.div`
  flex-direction: column;
`;

const MenuTitle = styled.div`
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
  object-fit: cover;
`;

const WithoutImg = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin: 10px 10px 10px 10px;
  text-align: right;
  flex-shrink: 1;
  background: #f0f0f0;
`;

function SearchMenuCard(props) {
  let starArry = [];

  renderStar(props.content.rating, starArry);

  return (
    <Menu>
      <Box>
        {props.content.imageUrl !== '' ? (
          <MenuImg src={props.content.imageUrl}></MenuImg>
        ) : (
          <WithoutImg></WithoutImg>
        )}

        <MenuInfo>
          <MenuTitle>{props.content.name}</MenuTitle>
          <SubTitle>NT.{props.content.price}</SubTitle>
        </MenuInfo>
      </Box>
      <MenuInfo style={{ paddingRight: '10px' }}>
        <Box style={{ justifyContent: 'center' }}>
          <MenuTitle style={{ textAlign: 'center' }}>
            {props.content.rating}
          </MenuTitle>
          <MenuTitle style={{ color: '#868686' }}>/5</MenuTitle>
        </Box>
        <RatingDiv>{starArry}</RatingDiv>
      </MenuInfo>
    </Menu>
  );
}

export default SearchMenuCard;
