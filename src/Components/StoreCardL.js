import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import SearchMenuCard from './SearchMenuCard';
import { getStoreMenu } from '../Utils/fetch';
import getMorereDetail from '../Utils/getMoreDetail';
import { getMenuData } from '../Utils/firebase';

import StarRender from '../Utils/StarRender';
import { tagType } from '../properties/properties';

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

  padding-bottom: 4px;
`;
const Store = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const StoreL = styled.div`
  padding: 8px 0;
  &:hover {
    background: #f7f7f7;
  }
`;

const StoreImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px 18px 10px 10px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const WithoutImg = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px 18px 10px 10px;
  text-align: right;
  flex-shrink: 1;
  background: #f0f0f0;
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
  const searchMenu = useSelector((state) => state.searchMenu);
  // const collectionMarks = useSelector((state) => state.collectionMarks);

  const [menu, setmenu] = React.useState(null);
  const dispatch = useDispatch();

  let priceLevel = [];
  let typesCheck = props.product.types.includes('food');

  let timestamp = '';

  const deliverCheck = props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl;

  useEffect(() => {
    if (searchMenu) {
      let menuArray = [];
      searchMenu.forEach((data) => {
        if (data.storeName === props.product.name) {
          menuArray.push(data);
        }
      });
      setmenu(menuArray);
    }
  }, [searchMenu, props.product]);

  const star = StarRender(props.product.rating, { width: 16, height: 16 });

  if (props.product.price_level !== undefined) {
    for (let i = 0; i < props.product.price_level; i++) {
      const leval = <Info key={i}>$</Info>;
      priceLevel.push(leval);
    }
  }

  if (props.product.opening_hours !== undefined) {
    const today = new Date().getDay();

    if (props.product.peridos) {
      timestamp = props.product.peridos[today].close.time.substring(0, 2);
    } else if (props.product.opening_hours.weekday_text) {
      timestamp = props.product.opening_hours.weekday_text[today].slice(5);
    }
  }

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: tagType.default
    });

    if (e.target.name === tagType.second) {
      dispatch({
        type: 'setSelectedTab',
        data: tagType.second
      });
    }

    if (!props.product.reviews && !props.product.deliver) {
      getStoreMenu(props.product.deliver);
      getMorereDetail(props.product, props.service).then((res) => {
        dispatch({
          type: 'setSelectedStore',
          data: res
        });
      });
    } else {
      dispatch({
        type: 'setSelectedStore',
        data: props.product
      });
    }

    if (deliverCheck) {
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

  function handleHoverEvent() {
    dispatch({
      type: 'setStoreHover',
      data: props.product
    });
  }
  function handleHoverOutEvent() {
    dispatch({
      type: 'setStoreHover',
      data: null
    });
  }

  return (
    <StoreL onClick={handleStoreListClick} onMouseOver={handleHoverEvent} onMouseOut={handleHoverOutEvent}>
      <Store id={props.id}>
        <StoreInfo id={props.id}>
          <StoreTitle id={props.id}>{props.product.name}</StoreTitle>
          <RatingDiv id={props.id}>
            <Info id={props.id}>{props.product.rating}</Info>

            <StarBox id={props.id}>{star}</StarBox>
            <Info id={props.id}>({props.product.user_ratings_total})</Info>
            {props.product.price_level && (
              <PriceLevel>
                <Info>・</Info> {priceLevel}
              </PriceLevel>
            )}
          </RatingDiv>
          <Info id={props.id}>{props.product.formatted_address}</Info>
          <Info id={props.id}>{props.product.formatted_phone_number}</Info>
          {props.product.opening_hours &&
            (props.product.peridos ? (
              <Info id={props.id}>營業至 下午{timestamp}:00</Info>
            ) : props.product.opening_hours.weekday_text ? (
              <Info id={props.id}>營業時間：{timestamp}</Info>
            ) : (
              <Info id={props.id}>營業中</Info>
            ))}

          {typesCheck && (
            <RatingDiv id={props.id}>
              <CheckIcon src="/true.png" /> <Info>內用</Info>
              <Info>．</Info>
              <CheckIcon src="/true.png" />
              <Info>外帶</Info>
              <Info>．</Info>
              <CheckIcon src={deliverCheck ? '/true.png' : '/false.png'} />
              <Info>外送</Info>
            </RatingDiv>
          )}
        </StoreInfo>
        {props.product.photos && props.product.photos.length > 0 ? (
          <StoreImg alt="" src={props.product.photos[0].getUrl()} id={props.id} />
        ) : props.product.photo ? (
          <StoreImg alt="" src={props.product.photo[0]} id={props.id} />
        ) : (
          <WithoutImg />
        )}
      </Store>
      {menu && menu.map((data, key) => <SearchMenuCard key={key} content={data} />)}
    </StoreL>
  );
}

export default StoreCard;
