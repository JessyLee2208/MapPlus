import React from 'react';
import styled from 'styled-components';

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;

  padding-left: 20px;
`;

const StoreTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 17px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 6px;
  padding-bottom: 4px;
`;
const Store = styled.div`
  position: relative;
  background: #ffffff;
  width: 100%;

  display: flex;
  justify-content: space-between;
  height: 128px;
`;
const StoreImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;
const Info = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #5d6267;
  margin: 1px;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
`;
const StarBox = styled.div`
  display: flex;
  margin: 0 6px;
  align-items: center;
`;
const Img = styled.img`
  width: 16px;
  height: 16px;
`;

const PriceLevel = styled.div`
  display: flex;
  align-items: center;
`;

function StoreCard(props, key) {
  let starArry = [];
  let priceLevel = [];
  let OpenStatu = <div></div>;
  let URL = <div></div>;
  let priceLevelDOM = <div></div>;

  if (props.product.rating) {
    const startAverage = Math.floor(props.product.rating);
    for (let i = 0; i < startAverage; i++) {
      const star = <Img src="/active_star.png" alt=""></Img>;
      starArry.push(star);
    }

    if (props.product.rating % startAverage !== 0) {
      for (let i = 0; i < 1; i++) {
        const star = <Img src="/half_star.png" alt=""></Img>;
        starArry.push(star);
      }
      for (let i = 0; i < 4 - startAverage; i++) {
        const star = <Img src="/default_star.png" alt=""></Img>;
        starArry.push(star);
      }
    } else {
      for (let i = 0; i < 5 - startAverage; i++) {
        const star = <Img src="/default_star.png" alt=""></Img>;
        starArry.push(star);
      }
    }

    for (let i = 0; i < props.product.price_level; i++) {
      const price = <Info>$</Info>;
      priceLevel.push(price);
    }
  }

  if (props.product.price_level !== undefined) {
    priceLevelDOM = (
      <PriceLevel>
        <Info>・</Info> {priceLevel}
      </PriceLevel>
    );
  }

  // console.log(props.product.business_status);
  if (props.product.business_status === 'OPERATIONAL' && props.product.peridos !== undefined) {
    const today = new Date().getDay();
    const timestamp = props.product.peridos[today].close.time.substring(0, 2);
    OpenStatu = <Info>營業至 下午{timestamp}:00</Info>;
  } else {
    OpenStatu = <Info></Info>;
  }

  if (props.product.photos.length !== 0) {
    URL = <StoreImg alt="" src={props.product.photos[0].getUrl()}></StoreImg>;
  }

  return (
    <Store>
      <StoreInfo>
        <StoreTitle>{props.product.name}</StoreTitle>
        <RatingDiv>
          <Info>{props.product.rating}</Info>
          <StarBox>{starArry}</StarBox>
          <Info>({props.product.user_ratings_total})</Info>
          {priceLevelDOM}
        </RatingDiv>
        <Info>{props.product.formatted_address}</Info>
        <Info>{props.product.formatted_phone_number}</Info>
        {OpenStatu}
      </StoreInfo>
      {URL}
    </Store>
  );
}

export default StoreCard;
