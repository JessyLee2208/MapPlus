import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Description, Link } from './UIComponents/Typography';
import { getStoreMenu } from '../Utils/fetch';
import getMorereDetail from '../Utils/getMoreDetail';
import { getMenuData } from '../Utils/firebase';
import { tagType } from '../properties/properties';

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 12px;
`;

const StoreTitle = styled.div`
  font-family: Roboto, Noto Sans TC, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 18px;
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
  height: 190px;
  position: relative;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border: 1px solid #efefef;
  margin: 20px 6px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.15);
  }
`;
const StoreImg = styled.img`
  width: 160px;
  height: 100px;
  border-radius: 8px 8px 0 0;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

const WithoutImg = styled.div`
  width: 160px;
  height: 100px;
  border-radius: 8px 8px 0 0;

  text-align: right;
  flex-shrink: 1;
  background: #f0f0f0;
`;

const Div = styled.div`
  height: 20px;
  display: flex;
  margin: 0;
  align-items: center;
`;
const StarBox = styled.div`
  display: flex;
  margin: 0 6px;
  align-items: center;
`;

const LinkDiv = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 10px;
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

function StoreCardS(props, key) {
  const selectedStore = useSelector((state) => state.selectedStore);
  const [selectedStyle, setSelectedStyle] = useState({ border: '1px solid #efefef' });

  let selected = props.product.name === selectedStore.name;
  const deliverCheck = props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl;

  let priceLevel = [];
  const dispatch = useDispatch();

  if (props.product.price_level !== undefined) {
    for (let i = 0; i < props.product.price_level; i++) {
      const leval = <Description key={i}>$</Description>;
      priceLevel.push(leval);
    }
  }

  useEffect(() => {
    if (selected) {
      setSelectedStyle({ border: '3px solid #1a73e8', borderRadius: '8px' });
    }
  }, [selectedStore, selected]);

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

    getStoreMenu(props.product.deliver);

    getMorereDetail(props.product, props.service).then((res) => {
      dispatch({
        type: 'setSelectedStore',
        data: res
      });
    });
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

    props.icon(true);
  }
  function handleHoverOutEvent() {
    dispatch({
      type: 'setStoreHover',
      data: null
    });
  }

  function imgTypeUseMethod() {
    if (props.product.photos?.length > 0) {
      return props.product.photos[0].getUrl();
    } else {
      return props.product.photo && props.product.photo[0];
    }
  }

  return (
    <Store
      id={props.id}
      onClick={handleStoreListClick}
      style={selected ? selectedStyle : { border: '1px solid #efefef' }}
      onMouseOver={handleHoverEvent}
      onMouseOut={handleHoverOutEvent}
    >
      {props.product.photos?.length > 0 || props.product.photo ? (
        <StoreImg
          id={props.id}
          alt=""
          src={imgTypeUseMethod()}
          style={selected ? { borderRadius: '4px 4px 0 0' } : { borderRadius: '8px 8px 0 0' }}
        ></StoreImg>
      ) : (
        <WithoutImg></WithoutImg>
      )}
      <StoreInfo id={props.id}>
        <StoreTitle id={props.id}>{props.product.name}</StoreTitle>
        <Div id={props.id}>
          <Description id={props.id}>{props.product.rating}</Description>
          <StarBox id={props.id}>
            <Img src="/active_star.png" alt=""></Img>
          </StarBox>
          <Description id={props.id}>({props.product.user_ratings_total})</Description>
          {props.product.price_level && (
            <Div id={props.id}>
              <Description>・</Description> {priceLevel}
            </Div>
          )}
        </Div>
        <LinkDiv id={props.id} className="Link">
          {props.product.website && <Link href={props.product.website}>網站</Link>}
          {props.product.website && deliverCheck && <Border>|</Border>}
          {deliverCheck && (
            <Link id={props.id} name="menu">
              菜單
            </Link>
          )}
        </LinkDiv>
      </StoreInfo>
    </Store>
  );
}

export default StoreCardS;
