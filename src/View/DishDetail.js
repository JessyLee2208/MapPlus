import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDishReviews, userDatasCheck } from '../Utils/firebase';
import Collection from '../Components/Collection';
import ReviewCard from '../Components/reviewCard';
import { ButtonPrimaryRound, ButtonGhostRound } from '../Components/UIComponents/Button';
import { PageTitle, SubTitle, SubItemTitle, H3Title } from '../Components/UIComponents/Typography';

import { SearchBg, SearchSeparator, Back } from '../Components/UIComponents/common';
import { deviceSize } from '../responsive/responsive';

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

const WithoutDishImg = styled.div`
  width: 100%;
  height: 112px;

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
  padding: 18px 20px;
`;

const CommentDiv = styled.div`
  display: flex;
  margin: 0;
  padding: 0 0 0 18px;
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
  border-bottom: 1px solid #efefef;
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
  const [custom, setCustom] = useState([]);

  let array = [];
  let customArray = [];
  let newRating = selectedDish.rating.toFixed(1);

  useEffect(() => {
    const unsubscribe = getAllDishReviews(selectedDish, callback);

    function callback(data) {
      setAllDishReviews(data);
    }

    return () => {
      unsubscribe();
    };
  }, [selectedDish]);

  useEffect(() => {
    if (userStatus) {
      async function reviewData() {
        let data = await userDatasCheck(userStatus);

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
        console.log(data);
        if (data && data.collectionList !== undefined) {
          // setCustomList(data.collectionList);
          dispatch({
            type: 'setCustomList',
            data: data.collectionList
          });
        }

        if (data && data.collection && data.collection.length !== 0) {
          let collectionArray = [];
          data.collection.forEach((collect) => {
            if (collect.storeCollectionID === selectedDish.storeCollectionID && collect.name === selectedDish.name) {
              collectionArray.push(collect);
            }
          });
          dispatch({
            type: 'setCollectData',
            data: collectionArray
          });
        }
      }
      reviewData();
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
  }, [userStatus, allDishReviews]);

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
    // props.check(true);
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

  if (collectData.length > 0) {
    collectData.forEach((data, key) => {
      let result = customList.find((check) => check === data.collectName);
      // console.log(result, customList);
      result !== undefined && customArray.push(result);

      let collect = (
        <RatingDiv key={key}>
          {data.collectName === '想去的地點' ? (
            <>
              <Icon src="/falg_select.png"></Icon>
              <CollectionBox>
                <Info style={{ fontSize: '15px' }}>已儲存於「{data.collectName}」</Info>
                <Info
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    margin: '0px 18px 0 0',
                    cursor: 'pointer'
                  }}
                  onClick={handleCollectionList}
                  id="想去的地點"
                >
                  查看清單
                </Info>
              </CollectionBox>
            </>
          ) : data.collectName === '喜愛的地點' ? (
            <>
              <Icon src="/heart_select.png"></Icon>
              <CollectionBox>
                <Info style={{ fontSize: '15px' }}>已儲存於「{data.collectName}」</Info>
                <Info
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    margin: '0px 18px 0 0',
                    cursor: 'pointer'
                  }}
                  onClick={handleCollectionList}
                  id="喜愛的地點"
                >
                  查看清單
                </Info>
              </CollectionBox>
            </>
          ) : (
            data.collectName === '已加星號的地點' && (
              <>
                <Icon src="/star_select.png"></Icon>
                <CollectionBox>
                  <Info style={{ fontSize: '15px' }}>已儲存於「{data.collectName}」</Info>
                  <Info
                    style={{
                      fontWeight: '600',
                      fontSize: '15px',
                      margin: '0px 18px 0 0',
                      cursor: 'pointer'
                    }}
                    onClick={handleCollectionList}
                    id="已加星號的地點"
                  >
                    查看清單
                  </Info>
                </CollectionBox>
              </>
            )
          )}
        </RatingDiv>
      );

      if (
        data.collectName === '想去的地點' ||
        data.collectName === '喜愛的地點' ||
        data.collectName === '已加星號的地點'
      ) {
        array.push(collect);
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
      <SearchSeparator></SearchSeparator>
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
      <SearchBg></SearchBg>
      {select && <Collection select={selected} check={props.check}></Collection>}
      {selectedDish.imageUrl ? (
        <DishImg src={selectedDish.imageUrl} alt=""></DishImg>
      ) : (
        <WithoutDishImg></WithoutDishImg>
      )}
      <div>
        <TopDiv>
          <DishBox>
            <PageTitle padding={'10px 0 10px 20px'}>{selectedDish.name}</PageTitle>

            <RatingDiv>
              <H3Title color={'185ee6'} padding={'0 20px 0 0'}>
                NT${selectedDish.price}
              </H3Title>
              <Icon src="/active_star.png" alt=""></Icon>
              <H3Title padding={' 0'} fontWeight={400} color={797979}>
                {newRating}
              </H3Title>
            </RatingDiv>
          </DishBox>
          <div>
            {collectData.length > 0 ? (
              <CollectIcon src="/collected.png" id="collectIcon" onClick={handleCollectIconClick}></CollectIcon>
            ) : (
              <CollectIcon src="/collect.png" id="collectIcon" onClick={handleCollectIconClick}></CollectIcon>
            )}
          </div>
        </TopDiv>
      </div>
      <div>
        {collectData.length > 0 && array}
        {collectData.length > 0 &&
          customArray.length > 0 &&
          customArray.map((list, key) => (
            <RatingDiv key={key}>
              <Icon src="/custom.png"></Icon>
              <CollectionBox>
                <Info style={{ fontSize: '15px' }}>已儲存於「{list}」</Info>
                <Info
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    margin: '0px 18px 0 0',
                    cursor: 'pointer'
                  }}
                  onClick={handleCollectionList}
                  id={list}
                >
                  查看清單
                </Info>
              </CollectionBox>
            </RatingDiv>
          ))}
      </div>

      {userReviewSet ? (
        <div>
          <CommentDiv>
            <CommentTitle style={{ color: 'black', margin: '10px 0 10px 0' }}>你的評論</CommentTitle>
          </CommentDiv>
          <ReviewCard review={userReviewSet} borderBottom={'none'}></ReviewCard>
        </div>
      ) : (
        <></>
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
      <Separator></Separator>
      {allDishReviews ? (
        allDishReviews.map((review, key) => <ReviewCard review={review} key={key}></ReviewCard>)
      ) : (
        <NoComment>目前沒有任何評論</NoComment>
      )}
    </Dish>
  );
}

export default DishDetail;
