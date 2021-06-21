import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import SearchMenuCard from './SearchMenuCard';
import StarRender from './StarRender';
import DeliverStateCheck from './DeliverStateCheck';
import { getStoreMenu } from '../Utils/fetch';
import getMorereDetail from '../Utils/getMoreDetail';
import { getMenuData } from '../Utils/firebase';
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

function StoreCard({ product, id, service }) {
  const searchMenu = useSelector((state) => state.searchMenu);

  const [menu, setmenu] = React.useState(null);
  const dispatch = useDispatch();

  let priceLevel = [];
  let timestamp = '';

  const deliverCheck = product.deliver.uberEatUrl || product.deliver.foodPandaUrl;

  useEffect(() => {
    if (searchMenu) {
      let menuArray = [];
      searchMenu.forEach((data) => {
        if (data.storeName === product.name) {
          menuArray.push(data);
        }
      });
      setmenu(menuArray);
    }
  }, [searchMenu, product]);

  const star = StarRender(product.rating, { width: 16, height: 16 });

  if (product.price_level !== undefined) {
    for (let i = 0; i < product.price_level; i++) {
      const leval = <Info key={i}>$</Info>;
      priceLevel.push(leval);
    }
  }

  if (product.opening_hours !== undefined) {
    const today = new Date().getDay();

    if (product.peridos) {
      timestamp = product.peridos[today].close.time.substring(0, 2);
    } else if (product.opening_hours.weekday_text) {
      timestamp = product.opening_hours.weekday_text[today].slice(5);
    }
  }

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: tagType.information
    });

    if (e.target.name === tagType.menu) {
      dispatch({
        type: 'setSelectedTab',
        data: tagType.menu
      });
    }
    getStoreMenu(product.deliver);
    if (!product.reviews) {
      getMorereDetail(product, service).then((res) => {
        dispatch({
          type: 'setSelectedStore',
          data: res
        });
      });
    } else {
      dispatch({
        type: 'setSelectedStore',
        data: product
      });
    }

    if (deliverCheck) {
      function setData(data) {
        dispatch({
          type: 'setMenuData',
          data: data
        });
      }
      getMenuData(product.name, setData);
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
      data: product
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
      <Store id={id}>
        <StoreInfo id={id}>
          <StoreTitle id={id}>{product.name}</StoreTitle>
          <RatingDiv id={id}>
            <Info id={id}>{product.rating}</Info>

            <StarBox id={id}>{star}</StarBox>
            <Info id={id}>({product.user_ratings_total})</Info>
            {product.price_level && (
              <PriceLevel>
                <Info>・</Info> {priceLevel}
              </PriceLevel>
            )}
          </RatingDiv>
          <Info id={id}>{product.formatted_address}</Info>
          <Info id={id}>{product.formatted_phone_number}</Info>
          {product.opening_hours &&
            (product.peridos ? (
              <Info id={id}>營業至 下午{timestamp}:00</Info>
            ) : product.opening_hours.weekday_text ? (
              <Info id={id}>營業時間：{timestamp}</Info>
            ) : (
              <Info id={id}>營業中</Info>
            ))}
          <DeliverStateCheck product={product} padding={'0'}></DeliverStateCheck>
        </StoreInfo>
        {product.photos && product.photos.length > 0 ? (
          <StoreImg alt="" src={product.photos[0].getUrl()} id={id} />
        ) : product.photo ? (
          <StoreImg alt="" src={product.photo[0]} id={id} />
        ) : (
          <WithoutImg />
        )}
      </Store>
      {menu && menu.map((data, key) => <SearchMenuCard key={key} content={data} />)}
    </StoreL>
  );
}

export default StoreCard;
