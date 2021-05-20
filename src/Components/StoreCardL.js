import React from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';

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
  margin: 10px 0;
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

const PriceLevel = styled.div`
  display: flex;
  align-items: center;
`;

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
  padding-right: 2px;
`;

function StoreCard(props) {
  let starArry = [];
  let priceLevel = [];
  let typesCheck = props.product.types.includes('food');
  let showType = <div></div>;
  let OpenStatu = <div></div>;

  renderStar(props.product.rating, starArry);
  // DeliverURLCheck(props.product.deliver.foodPandaUrl, props.product.deliver.uberEatUrl, deliverSite, deliverSiteTag);
  if (typesCheck) {
    if (props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl) {
      showType = (
        <RatingDiv id={props.id}>
          <CheckIcon src="/true.png"></CheckIcon> <Info>內用</Info>
          <Info>．</Info>
          <CheckIcon src="/true.png"></CheckIcon> <Info>外帶</Info>
          <Info>．</Info>
          <CheckIcon src="/true.png"></CheckIcon> <Info>外送</Info>
        </RatingDiv>
      );
    } else {
      showType = (
        <RatingDiv>
          <CheckIcon src="/true.png"></CheckIcon> <Info>內用</Info>
          <Info>．</Info>
          <CheckIcon src="/true.png"></CheckIcon> <Info>外帶</Info>
          <Info>．</Info>
          <CheckIcon src="/false.png"></CheckIcon> <Info>外送</Info>
        </RatingDiv>
      );
    }
  }

  if (props.product.price_level !== undefined) {
    for (let i = 0; i < props.product.price_level; i++) {
      const leval = <Info>$</Info>;
      priceLevel.push(leval);
    }
  }

  if (props.product.opening_hours !== undefined) {
    const today = new Date().getDay();

    if (props.product.peridos) {
      const timestamp = props.product.peridos[today].close.time.substring(0, 2);
      OpenStatu = <Info id={props.id}>營業至 下午{timestamp}:00</Info>;
    } else if (props.product.opening_hours.weekday_text) {
      const timestamp = props.product.opening_hours.weekday_text[today].slice(5);
      OpenStatu = <Info id={props.id}>營業中：{timestamp}</Info>;
    } else {
      OpenStatu = <Info id={props.id}>營業中</Info>;
    }
  } else {
    OpenStatu = <Info></Info>;
  }

  return (
    <Store id={props.id} position={props.position}>
      <StoreInfo id={props.id}>
        <StoreTitle id={props.id} position={props.position}>
          {props.product.name}
        </StoreTitle>
        <RatingDiv id={props.id}>
          <Info id={props.id}>{props.product.rating}</Info>
          <StarBox id={props.id}>{starArry}</StarBox>
          <Info id={props.id}>({props.product.user_ratings_total})</Info>
          {props.product.price_level ? (
            <PriceLevel>
              <Info>・</Info> {priceLevel}
            </PriceLevel>
          ) : (
            <div></div>
          )}
        </RatingDiv>
        <Info id={props.id}>{props.product.formatted_address}</Info>
        <Info id={props.id}>{props.product.formatted_phone_number}</Info>
        {OpenStatu}
        {showType}
      </StoreInfo>
      {props.product.photos.length !== 0 ? (
        <StoreImg alt="" src={props.product.photos[0].getUrl()} id={props.id}></StoreImg>
      ) : (
        <div></div>
      )}
    </Store>
  );
}

export default StoreCard;
