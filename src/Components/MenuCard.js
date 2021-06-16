import React, { useEffect } from 'react';
import styled from 'styled-components';

import StarRender from '../Utils/StarRender';
import { useDispatch, useSelector } from 'react-redux';
import { userReviewGet } from '../Utils/firebase';
import { ButtonPrimaryRound, ButtonGhostRound } from './UIComponents/Button';
import { ItemTitle, Description } from './UIComponents/Typography';
import { deviceSize } from '../responsive/responsive';

const Menu = styled.div`
  background: #ffffff;
  display: grid;
  grid-template-columns: 90px 235px 68px;

  align-items: center;
  padding: 12px 20px;

  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
  @media screen and (max-width: ${deviceSize.mobile}px) {
    display: flax;
    padding: 12px 16px;
  }
`;

const MenuImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  // margin: 10px 10px 10px 18px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    width: 60px;
    height: 60px;
  }
`;

const NoImg = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  // margin: 10px 10px 10px 18px;
  text-align: right;
  flex-shrink: 1;

  background: #f0f0f0;

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    width: 60px;
    height: 60px;
  }
`;

const InfoBox = styled.div`
  display: block;
  padding: 0px 8px 0 14px;
  flex-direction: column;

  flex-grow: 2;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  padding-bottom: 12px;
`;

function MenuCard({ data }) {
  // let starArry = [];
  const [userDatasCheck, setuserDatasCheck] = React.useState(null);

  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);

  let newRating = data.rating.toFixed(1);

  useEffect(() => {
    if (userStatus) {
      async function reviewData() {
        let userDatas = await userReviewGet(data.storeName, userStatus);

        if (userDatas) {
          const target = userDatas.find(
            (userData) => userData.storeCollectionID === data.storeCollectionID && userData.dishName === data.name
          );

          target ? setuserDatasCheck(target) : setuserDatasCheck(null);
        }

        // }
      }
      reviewData();
    }
  }, [userStatus, data]);

  const star = StarRender(data.rating, { width: 16, height: 16 });

  function callModal(e) {
    if (userDatasCheck) {
      dispatch({
        type: 'setUserReviewSet',
        data: userDatasCheck
      });
    } else {
      dispatch({
        type: 'setUserReviewSet',
        data: null
      });
    }

    dispatch({
      type: 'setModalShow',
      data: true
    });

    dispatch({
      type: 'setSelectedDish',
      data: data
    });
  }

  return (
    <Menu id={data.name}>
      {data.imageUrl !== '' ? <MenuImg alt="" src={data.imageUrl} id={data.name} /> : <NoImg id={data.name} />}

      <InfoBox id={data.name}>
        <div id={data.name}>
          <ItemTitle id={data.name} padding={'0 0 6px 0'}>
            {data.name}
          </ItemTitle>
          <RatingDiv id={data.name}>
            <Description padding={'0 6px 0 0'} id={data.name}>
              {newRating}
            </Description>
            {star}
          </RatingDiv>
        </div>
        <ItemTitle id={data.name} color={'185ee6'}>
          NT$ {data.price}
        </ItemTitle>
      </InfoBox>
      {!userDatasCheck ? (
        <ButtonGhostRound type="button" onClick={callModal}>
          評論
        </ButtonGhostRound>
      ) : (
        <ButtonPrimaryRound type="button" onClick={callModal}>
          編輯
        </ButtonPrimaryRound>
      )}
    </Menu>
  );
}

export default MenuCard;
