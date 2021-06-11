import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deviceSize } from '../responsive/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { Description, H3Title, ItemTitle } from '../Components/UIComponents/Typography';
import { userDatasCheck, googleAccountLogOut } from '../Utils/firebase';
import { ButtonGhostRound } from '../Components/UIComponents/Button';
import useMediaQuery from '../Utils/useMediaQuery';
import toast, { Toaster } from 'react-hot-toast';
import { InfiniteLoading, Loading } from '../Components/UIComponents/LottieAnimat';

const Member = styled.div`
  position: fixed;
  top: 58px;
  right: 10px;

  background: #ffffff;
  width: 300px;
  height: auto;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  box-shadow: 0 2px 7px rgb(0 0 0 / 11%), 0 0px 12px rgb(0 0 0 / 5%);
  border-radius: 8px;
  z-index: 3;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
    height: 101vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    border-radius: 0px;
  }
`;

const AuthorImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;

  margin-top: 18px;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    margin-top: 50px;
  }
`;

const Separator = styled.div`
  width: 100%;
  min-height: 1px;
  background: #efefef;
  margin: 10px 0;
`;

const ItemBox = styled.div`
  width: 100%;
  padding: 4px 0;

  cursor: pointer;
  &:hover {
    background: #f7f7f7;
  }
`;

const CollectLists = styled.div`
  width: 100%;
  display: flex;
  margin: 0;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    padding-left: 80px;
  }
`;

const CollectListBox = styled.div`
  display: flex;
  margin: 0;
  padding-left: 64px;
  padding-right: 28px;
  margin: 4px 0;
  align-items: center;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    padding-left: 80px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 14px;
`;

function MemberPage(props) {
  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);
  const userStatus = useSelector((state) => state.userStatus);
  const customList = useSelector((state) => state.customList);

  const dispatch = useDispatch();

  const [wantList, setWantList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [customListCounts, setCustomListCount] = useState([]);

  const checkAnimationLoader =
    wantList.length > 0 || likeList.length > 0 || starList.length > 0 || customListCounts.length > 0;

  useEffect(() => {
    async function reviewData() {
      let data = await userDatasCheck(userStatus);
      let want = [];
      let like = [];
      let star = [];
      let custom = [];
      let customListCount = [];
      console.log('data.collection', data.collection, 'data', data);
      if (data && data.collection && data.collection.length !== 0) {
        data.collection.forEach((collect) => {
          if (collect.collectName === '想去的地點') {
            want.push(collect);
          } else if (collect.collectName === '喜愛的地點') {
            like.push(collect);
          } else if (collect.collectName === '已加星號的地點') {
            star.push(collect);
          } else if (
            collect.collectName !== '已加星號的地點' &&
            collect.collectName !== '已加星號的地點' &&
            collect.collectName !== '想去的地點'
          ) {
            custom.push(collect);
            // customList.map((list) => collect.collectName === list && custom.push(list));

            // const a = customList.filter((list) => collect.collectName === list);
            // console.log(a);
          }
        });

        // for (let i = 0; i < data.collectionList.length; i++) {
        //   const title = String.fromCharCode(i + 65);
        //   console.log(title);
        //   // const [title, set] = useState([]);
        //   let title = [];
        // }

        // console.log(custom);
        customList.forEach((list, index) => {
          console.log(index);

          index = custom.filter((data) => data.collectName === list);
          // const a = data.collection.filter((collect) => collect.name === list);
          console.log(index, index.length);
          customListCount.push(index.length);
          // customList.filter((list) => collect.collectName === list);
        });
        console.log(customListCount);
        setCustomListCount(customListCount);

        if (data && data.collectionList.length > 0) {
          dispatch({
            type: 'setCustomList',
            data: data.collectionList
          });
        }

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
    props.show(false);
  }

  function close() {
    props.show(false);
  }

  const notify = () =>
    toast('成功登出', {
      style: {
        borderRadius: '4px',
        background: '#333',
        color: '#fff'
      }
    });

  console.log(!checkAnimationLoader, isMobile);

  return (
    <Member>
      {isMobile && (
        <Icon src="/close_big.png" style={{ position: 'fixed', right: '0px', top: '10px' }} onClick={close}></Icon>
      )}

      <AuthorImg src={userStatus.photoURL} alt=""></AuthorImg>
      <H3Title>{userStatus.displayName}</H3Title>
      <Description padding={'0 0 8px 0'}>{userStatus.email}</Description>
      <Separator></Separator>
      {checkAnimationLoader ? (
        <CollectLists>
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
          {customList.length > 0 &&
            customList.map((list, index) => (
              <ItemBox onClick={handleCollectionList}>
                <CollectListBox id={list}>
                  <Icon src={'/custom.png'} id={list}></Icon>
                  <ItemTitle
                    id={list}
                    padding={'0 10px 0 0}'}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {list}
                  </ItemTitle>
                  <Description id={list}>({customListCounts.length > 0 ? customListCounts[index] : 0})</Description>
                </CollectListBox>
              </ItemBox>
            ))}
        </CollectLists>
      ) : (
        <InfiniteLoading marginTop={20}></InfiniteLoading>
      )}

      <Separator></Separator>
      <ButtonGhostRound
        onClick={(e) => {
          googleAccountLogOut(e, dispatch);

          notify();

          dispatch({
            type: 'setCollectionTitle',
            data: false
          });
          dispatch({
            type: 'setloginToast',
            data: false
          });
        }}
        margin={'6px 0 16px 0'}
      >
        登出
      </ButtonGhostRound>
    </Member>
  );
}

export default MemberPage;
