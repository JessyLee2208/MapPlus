import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getStoreMenu } from '../Utils/fetch';
import getMorereDetail from '../Utils/getMoreDetail';
import { getMenuData } from '../Utils/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Description, Link } from './UIComponents/Typography';

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
  }, [selectedStore]);

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
      // console.log(res);
      dispatch({
        type: 'setSelectedStore',
        data: res
      });
    });
    if (props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl) {
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
    // console.log(...props.product);
    dispatch({
      type: 'setStoreHover',
      data: props.product
    });
    // e.stopPropagation();
    props.icon(true);

    //
    // console.log(props.icon);
  }
  function handleHoverOutEvent() {
    dispatch({
      type: 'setStoreHover',
      data: null
    });
  }

  return (
    <Store
      id={props.id}
      onClick={handleStoreListClick}
      style={selected ? selectedStyle : { border: '1px solid #efefef' }}
      onMouseOver={handleHoverEvent}
      onMouseOut={handleHoverOutEvent}
    >
      {props.product.photos && props.product.photos.length > 0 ? (
        <StoreImg
          id={props.id}
          alt=""
          src={props.product.photos[0].getUrl()}
          style={selected ? { borderRadius: '4px 4px 0 0' } : { borderRadius: '8px 8px 0 0' }}
        ></StoreImg>
      ) : props.product.photo ? (
        <StoreImg
          id={props.id}
          alt=""
          src={props.product.photo[0]}
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
          {props.product.website && (props.product.deliver.foodPandaUrl || props.product.deliver.uberEatUrl) && (
            <Border>|</Border>
          )}
          {props.product.deliver.foodPandaUrl ? (
            <Link id={props.id} name="menu">
              菜單
            </Link>
          ) : (
            props.product.deliver.uberEatUrl && (
              <Link id={props.id} name="menu">
                菜單
              </Link>
            )
          )}
        </LinkDiv>
      </StoreInfo>
    </Store>
  );
}

export default StoreCardS;
