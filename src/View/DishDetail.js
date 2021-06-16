import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDishReviews } from '../Utils/firebase';
import Collection from '../Components/Collection';
import ReviewCard from '../Components/reviewCard';
import { ButtonPrimaryRound, ButtonGhostRound } from '../Components/UIComponents/Button';
import { PageTitle, SubTitle, SubItemTitle, H3Title } from '../Components/UIComponents/Typography';

import { SearchBg, SearchSeparator, Back } from '../Components/UIComponents/common';
import { deviceSize } from '../responsive/responsive';
import useUserDataCheck from '../Utils/useUserDataCheck';

const Separator = styled.div`
  width: auto;
  min-height: 1px;
  background: #efefef;
`;

const Dish = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
    height: 100vh;
  }
`;

const DishImg = styled.img`
  width: 100%;
  height: 260px;

  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  padding: 0 0 0 18px;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
`;

const Box = styled.div`
  display: flex;

  align-items: center;
  padding: 18px 0px 10px 20px;
`;

const CommentDiv = styled.div`
  display: flex;
  margin: 0;
  // padding: 0 0 0 px;
  flex-direction: column;
`;

const Info = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #797979;
  margin: 1px;
`;

const CommentTitle = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  margin: 10px 0;
  // border-bottom: 1px solid #efefef;
  padding-bottom: 10px;
`;

const Icon = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 4px;
`;

const TopDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const DishBox = styled.div`
  display: flex;

  width: 380px;
  flex-direction: column;
`;

const DivBox = styled.div`
  display: flex;

  width: 100%;
  flex-direction: column;
`;

const NoComment = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: ##b3b3b3;
  margin: 80px 0 0 0 ;
  letter-spacing: 0.5px;　
`;

const CollectIcon = styled.img`
  // width: 30px;
  height: 30px;
  margin-right: 16px;
  padding: 6px;
  border-radius: 50%;

  &:hover {
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.15);
  }
`;

const InfoBold = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #black;
  margin: 0px 0 0 10px;
`;

const CollectionBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

function DishDetail(props) {
  const selectedDish = useSelector((state) => state.selectedDish);
  const userStatus = useSelector((state) => state.userStatus);

  const collectData = useSelector((state) => state.collectData);
  const userReviewSet = useSelector((state) => state.userReviewSet);
  const customList = useSelector((state) => state.customList);

  const dispatch = useDispatch();

  const [allDishReviews, setAllDishReviews] = useState(null);
  const [select, selected] = useState(false);

  let customArray = [];
  let newRating = selectedDish.rating.toFixed(1);
  let noImg = '/noImg.png';

  const basicLists = [
    { collectName: '想去的地點', defaultIcon: '/falg.png', activeIcon: '/falg_select.png' },
    { collectName: '喜愛的地點', defaultIcon: '/heart.png', activeIcon: '/heart_select.png' },
    { collectName: '已加星號的地點', defaultIcon: '/active_star.png', activeIcon: '/star_select.png' }
  ];

  const infoStyled = {
    fontWeight: '600',
    fontSize: '15px',
    margin: '0px 18px 0 0',
    cursor: 'pointer'
  };

  useEffect(() => {
    const unsubscribe = getAllDishReviews(selectedDish, callback);

    function callback(data) {
      setAllDishReviews(data);
    }

    return () => {
      unsubscribe();
    };
  }, [selectedDish]);

  const userData = useUserDataCheck();

  useEffect(() => {
    if (userStatus) {
      if (allDishReviews) {
        const target = allDishReviews.find(
          (data) =>
            data.storeCollectionID === selectedDish.storeCollectionID &&
            data.dishName === selectedDish.name &&
            data.email === userStatus.email
        );

        target
          ? dispatch({
              type: 'setUserReviewSet',
              data: target
            })
          : dispatch({
              type: 'setUserReviewSet',
              data: null
            });
      }

      if (userData && userData.collection && userData.collection.length !== 0) {
        let collectionArray = [];
        userData.collection.forEach((collect) => {
          if (collect.storeCollectionID === selectedDish.storeCollectionID && collect.name === selectedDish.name) {
            collectionArray.push(collect);
          }
        });

        dispatch({
          type: 'setCollectData',
          data: collectionArray
        });
      } else {
        dispatch({
          type: 'setCollectData',
          data: []
        });
      }
    } else {
      dispatch({
        type: 'setCollectData',
        data: []
      });
      dispatch({
        type: 'setUserReviewSet',
        data: null
      });
    }
  }, [userStatus, allDishReviews, userData, selectedDish, dispatch]);

  function callModal(e) {
    dispatch({
      type: 'setModalShow',
      data: true
    });
  }

  function handleCollectIconClick(e) {
    if (userStatus) {
      if (e.target.id === 'collectIcon' || e.target.id === 'collect') {
        selected(true);
      } else {
        selected(false);
      }
    } else {
      dispatch({
        type: 'setModalShow',
        data: true
      });
    }
  }

  function handleStatusCheck() {
    if (select) {
      selected(false);
    }
  }

  function handleCollectionList(e) {
    dispatch({
      type: 'setCollectionTitle',
      data: e.target.id
    });
  }

  if (collectData && collectData.length > 0) {
    collectData.forEach((data, key) => {
      if (customList) {
        let result = customList.find((check) => check === data.collectName);
        result !== undefined && customArray.push(result);
      }

      if (
        data.collectName === '想去的地點' ||
        data.collectName === '喜愛的地點' ||
        data.collectName === '已加星號的地點'
      ) {
      }
    });
  }

  function handleBack() {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });

    dispatch({
      type: 'setCollectData',
      data: []
    });
  }

  function handle() {
    dispatch({
      type: 'setMarkerHover',
      data: null
    });
  }

  return (
    <Dish onClick={handleStatusCheck} onMouseOver={handle}>
      <SearchSeparator />
      <Back>
        <SubItemTitle
          onClick={handleBack}
          color={'185ee6'}
          style={{
            position: 'relative',
            bottom: '-56px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          回到 {selectedDish.storeName}
        </SubItemTitle>
      </Back>
      <SearchBg />
      {select && <Collection select={selected} check={props.check} />}
      <DishImg
        src={selectedDish.imageUrl || noImg}
        alt=""
        style={{ height: selectedDish.imageUrl ? '260px' : '112px' }}
      />
      <TopDiv>
        <DishBox>
          <PageTitle padding={'10px 0 10px 20px'}>{selectedDish.name}</PageTitle>

          <RatingDiv>
            <H3Title color={'185ee6'} padding={'0 20px 0 0'}>
              NT${selectedDish.price}
            </H3Title>
            <Icon src="/active_star.png" alt="" />
            <H3Title padding={' 0'} fontWeight={400} color={797979}>
              {newRating}
            </H3Title>
          </RatingDiv>
        </DishBox>
        <div>
          {collectData.length > 0 || customArray.length > 0 ? (
            <CollectIcon src="/collected.png" id="collectIcon" onClick={handleCollectIconClick} />
          ) : (
            <CollectIcon src="/collect.png" id="collectIcon" onClick={handleCollectIconClick} />
          )}
        </div>
      </TopDiv>

      <DivBox>
        {collectData &&
          collectData.length > 0 &&
          collectData.map((data, key) =>
            basicLists.map(
              (list) =>
                data.collectName === list.collectName && (
                  <RatingDiv key={key}>
                    <Icon src={list.activeIcon} />
                    <CollectionBox>
                      <Info style={{ fontSize: '15px' }}>已儲存於「{data.collectName}」</Info>
                      <Info style={infoStyled} onClick={handleCollectionList} id={list.collectName}>
                        查看清單
                      </Info>
                    </CollectionBox>
                  </RatingDiv>
                )
            )
          )}

        {collectData.length > 0 &&
          customArray.length > 0 &&
          customArray.map((list, key) => (
            <RatingDiv key={key}>
              <Icon src="/custom.png" />
              <CollectionBox>
                <Info style={{ fontSize: '15px' }}>已儲存於「{list}」</Info>
                <Info style={infoStyled} onClick={handleCollectionList} id={list}>
                  查看清單
                </Info>
              </CollectionBox>
            </RatingDiv>
          ))}
      </DivBox>

      {userReviewSet && (
        <div>
          <CommentDiv>
            <CommentTitle style={{ color: 'black', margin: '10px 0 0px 18px' }}>你的評論</CommentTitle>
            <Separator />
          </CommentDiv>
          <ReviewCard review={userReviewSet} borderBottom={'none'} />
        </div>
      )}

      {!userReviewSet ? (
        <ButtonGhostRound onClick={callModal} style={{ margin: '0px 18px' }}>
          評論
        </ButtonGhostRound>
      ) : (
        <ButtonPrimaryRound onClick={callModal} style={{ margin: '0px 18px' }}>
          編輯你的評論
        </ButtonPrimaryRound>
      )}

      <Box>
        <SubTitle padding={'0'}>評論</SubTitle>
        {allDishReviews ? <SubTitle padding={'0 0 0 8px'}>{allDishReviews.length}</SubTitle> : <InfoBold>0</InfoBold>}
      </Box>
      <Separator />
      {allDishReviews ? (
        allDishReviews.map((review, key) => <ReviewCard review={review} key={key} />)
      ) : (
        <NoComment>目前沒有任何評論</NoComment>
      )}
    </Dish>
  );
}

export default DishDetail;
