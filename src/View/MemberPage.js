import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deviceSize } from '../responsive/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { Description, H3Title, ItemTitle } from '../Components/UIComponents/Typography';
import { userDatasCheck, googleAccountLogOut } from '../Utils/firebase';
import { ButtonGhostRound } from '../Components/UIComponents/Button';

const Member = styled.div`
  position: fixed;
  top: 58px;
  right: 10px;

  background: #ffffff;
  width: 300px;
  height: 60vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  box-shadow: 0 2px 7px rgb(0 0 0 / 11%), 0 0px 12px rgb(0 0 0 / 5%);
  border-radius: 8px;
  z-index: 3;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
    height: 100vh;
  }
`;

const AuthorImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;

  margin-top: 18px;
`;

const Separator = styled.div`
  width: 100%;
  min-height: 1px;
  background: #efefef;
  margin: 10px 0;
`;

const ItemBox = styled.div`
  width: 100%;
  margin: 2px 0;
  &:hover {
    background: #f7f7f7;
  }
`;

const CollectListBox = styled.div`
  display: flex;
  margin: 0;
  padding-left: 64px;
  margin: 6px 0;
  align-items: center;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 14px;
`;

function MemberPage(props) {
  const userStatus = useSelector((state) => state.userStatus);

  const dispatch = useDispatch();

  const [wantList, setWantList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [starList, setStarList] = useState([]);

  useEffect(() => {
    async function reviewData() {
      let data = await userDatasCheck(userStatus);
      let want = [];
      let like = [];
      let star = [];

      if (data && data.collection && data.collection.length !== 0) {
        console.log(data.collection);

        data.collection.forEach((collect) => {
          if (collect.collectName === '想去的地點') {
            want.push(collect);
          } else if (collect.collectName === '喜愛的地點') {
            like.push(collect);
          } else if (collect.collectName === '已加星號的地點') {
            star.push(collect);
          }
        });

        setWantList(want);
        setLikeList(like);
        setStarList(star);
      }
    }
    reviewData();
  }, []);

  function handleCollectionList(e) {
    dispatch({
      type: 'setCollectionTitle',
      data: e.target.id
    });
    dispatch({
      type: 'setCollectionList',
      data: []
    });
  }

  return (
    <Member>
      <AuthorImg src={userStatus.photoURL} alt=""></AuthorImg>
      <H3Title>{userStatus.displayName}</H3Title>
      <Description padding={'0 0 8px 0'}>{userStatus.email}</Description>
      <Separator></Separator>

      <ItemBox onClick={handleCollectionList}>
        <CollectListBox id="想去的地點">
          <Icon src={'/falg.png'} id="想去的地點"></Icon>
          <ItemTitle id="想去的地點" padding={'0 10px 0 0}'}>
            想去的地點
          </ItemTitle>
          <Description id="想去的地點">({wantList.length > 0 ? wantList.length : 0}) </Description>
        </CollectListBox>
      </ItemBox>
      <ItemBox onClick={handleCollectionList}>
        <CollectListBox id="喜愛的地點">
          <Icon src={'/heart.png'} id="喜愛的地點"></Icon>
          <ItemTitle id="喜愛的地點" padding={'0 10px 0 0}'}>
            喜愛的地點
          </ItemTitle>
          <Description id="喜愛的地點">({likeList.length > 0 ? likeList.length : 0}) </Description>
        </CollectListBox>
      </ItemBox>
      <ItemBox onClick={handleCollectionList}>
        <CollectListBox id="已加星號的地點">
          <Icon src={'/active_star.png'} id="已加星號的地點"></Icon>
          <ItemTitle id="已加星號的地點" padding={'0 10px 0 0}'}>
            已加星號的地點
          </ItemTitle>
          <Description id="已加星號的地點">({starList.length > 0 ? starList.length : 0}) </Description>
        </CollectListBox>
      </ItemBox>
      <Separator></Separator>
      <ButtonGhostRound
        onClick={(e) => {
          googleAccountLogOut(e, dispatch);
          //   setlogOutToast(!logOutToast);
        }}
        margin={'6px 0 0 0'}
      >
        登出
      </ButtonGhostRound>
    </Member>
  );
}

export default MemberPage;
