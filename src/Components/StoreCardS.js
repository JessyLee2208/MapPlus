import React from 'react';
import styled from 'styled-components';
import { getStoreMenu } from '../Utils/fetch';
import getMorereDetail from '../Utils/getMoreDetail';
import { getMenuData } from '../Utils/firebase';
import { useDispatch } from 'react-redux';

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 12px;
`;

const StoreTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 8px;
  padding-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Store = styled.div`
  width: 160px;
  height: 200px;
  position: relative;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border: 1px solid #efefef;
  margin: 20px 6px;
  border-radius: 8px;
`;
const StoreImg = styled.img`
  width: 160px;
  height: 100px;
  border-radius: 8px 8px 0 0;
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
const Img = styled.img`
  width: 16px;
  height: 16px;
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

const LinkDiv = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 10px;
`;

const InfoLink = styled.a`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #185EE6;
  margin: 1px;
  letter-spacing: 0.5px;　
  text-decoration:none;
  flex-grow:1;
`;
const InfoMenu = styled.a`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #185EE6;
  margin: 1px;
  letter-spacing: 0.5px;　
  text-decoration:none;
  flex-grow:1;
`;

const Border = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #d7d7d7;
  margin: 1px;
  margin: 0;
`;

const WithoutImg = styled.div`
  width: 160px;
  height: 100px;
  border-radius: 8px 8px 0 0;

  text-align: right;
  flex-shrink: 1;
  background: #f0f0f0;
`;

function StoreCardS(props, key) {
  let priceLevel = [];
  const dispatch = useDispatch();

  if (props.product.price_level !== undefined) {
    for (let i = 0; i < props.product.price_level; i++) {
      const leval = <Info>$</Info>;
      priceLevel.push(leval);
    }
  }

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    if (e.target.name === 'menu') {
      dispatch({
        type: 'setSelectedTab',
        data: 'menu'
      });
    }
    getStoreMenu(props.product.deliver);
    getMorereDetail(props.product, props.service).then((res) => {
      dispatch({
        type: 'setSelectedStore',
        data: res
      });
    });
    if (
      props.product.deliver.uberEatUrl ||
      props.product.deliver.foodPandaUrl
    ) {
      function setData(data) {
        dispatch({
          type: 'setMenuData',
          data: data
        });
      }
      getMenuData(props.product.name, setData);
    } else {
      dispatch({
        type: 'setMenuData',
        data: null
      });
    }
  }

  return (
    <Store id={props.id} onClick={handleStoreListClick}>
      {props.product.photos && props.product.photos.length > 0 ? (
        <StoreImg
          id={props.id}
          alt=""
          src={props.product.photos[0].getUrl()}
        ></StoreImg>
      ) : props.product.photo ? (
        <StoreImg id={props.id} alt="" src={props.product.photo[0]}></StoreImg>
      ) : (
        <WithoutImg></WithoutImg>
      )}
      <StoreInfo id={props.id}>
        <StoreTitle id={props.id}>{props.product.name}</StoreTitle>
        <RatingDiv id={props.id}>
          <Info id={props.id}>{props.product.rating}</Info>
          <StarBox id={props.id}>
            <Img src="/active_star.png" alt=""></Img>
          </StarBox>
          <Info id={props.id}>({props.product.user_ratings_total})</Info>
          {props.product.price_level ? (
            <PriceLevel id={props.id}>
              <Info>・</Info> {priceLevel}
            </PriceLevel>
          ) : (
            <div></div>
          )}
          {/* {priceLevelDOM} */}
        </RatingDiv>
        <LinkDiv id={props.id} className="Link">
          {props.product.website ? (
            <InfoLink href={props.product.website}>網站</InfoLink>
          ) : (
            ''
          )}
          {props.product.website &&
          (props.product.deliver.foodPandaUrl ||
            props.product.deliver.uberEatUrl) ? (
            <Border>|</Border>
          ) : (
            ''
          )}
          {props.product.deliver.foodPandaUrl ? (
            <InfoMenu id={props.id} name="menu">
              菜單
            </InfoMenu>
          ) : props.product.deliver.uberEatUrl ? (
            <InfoMenu id={props.id} name="menu">
              菜單
            </InfoMenu>
          ) : (
            ''
          )}
        </LinkDiv>
      </StoreInfo>
    </Store>
  );
}

export default StoreCardS;
