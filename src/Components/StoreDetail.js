import React from 'react';
import styled from 'styled-components';
// import stat from '../';

const product = {
  business_status: 'OPERATIONAL',
  formatted_address: '235台灣新北市中和區中和路38號',
  geometry: { location: { lat: 25.020397, lng: 121.533053 } },

  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
  photo: 'https://lh3.googleusercontent.com/p/AF1QipNRV2UIGgC0MpU4B3owIKFjLF9fK7dP-vTkxw8V=s1600-w768',
  name: '麥當勞-中和店',
  place_id: 'ChIJV3oxq9epQjQR7bVgz_E6z54',
  plus_code: { compound_code: '2F2X+JX 中和區 新北市', global_code: '7QQ32F2X+JX' },
  price_level: 1,
  rating: 3.7,
  user_ratings_total: 1460,
  formatted_phone_number: '0222460725',
  website: 'https://www.mcdonalds.com/tw/zh-tw.html',
  peridos: [
    {
      close: { day: 0, hours: 22, minutes: 0, nextDate: 1621173600000, time: '2200' },
      open: {
        day: 0,
        hours: 13,
        minutes: 0,
        nextDate: 1621141200000,
        time: '1300'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    }
  ]
};
const Store = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;

  display: flex;
  height: 100%;
  flex-direction: column;
`;

const StoreImg = styled.img`
  width: 100%;
  height: 260px;

  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const StoreTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding: 12px 0 12px 18px;
`;

function StoreDetail(props) {
  return (
    <Store>
      <StoreImg src={product.photo}></StoreImg>
      <StoreTitle>{product.name}</StoreTitle>
    </Store>
  );
}

export default StoreDetail;
