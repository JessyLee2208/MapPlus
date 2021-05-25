import React, { useEffect } from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDishReviews, userDatasCheck } from '../Utils/firebase';
import Collection from '../Components/Collection';
import CollectionList from '../View/CollectionList';

const Dish = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
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

const DishTitle = styled.div`
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

const DishPrice = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: normal;
  text-align: left;
  color: #185ee6;
  margin: 1px;
  // padding: 2px 0 12px 18px;
  padding-right: 20px;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  padding: 0 0 0 18px;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
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

const P = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #797979;
  margin: 0px 0 0 8px;
`;

const Icon = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 4px;
`;

const CommentBtn = styled.button`
  border: 1px solid #185ee6;
  background: #fff;
  color: #185ee6;

  border-radius: 25px;
  padding: 0.4em 2em;
  font-size: 15px;
  margin: 0px 18px 0px 18px;
`;

const EditorBtn = styled.button`
  border: 1px solid #4285f4;
  background: #4285f4;
  color: #fff;

  border-radius: 25px;
  padding: 0.4em 2em;
  font-size: 15px;
  margin: 0px 18px 0px 18px;
`;

const TopDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // border-bottom: 1px solid #efefef;
`;
const DishBox = styled.div`
  display: flex;
  // align-items: center;
  width: 380px;
  flex-direction: column;
`;

const ReviewerBox = styled.div`
  padding: 8px 16px 18px 18px;
  align-items: center;
  flex-irection: 'column';
  border-bottom: 1px solid #efefef;
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 0 14px 0;
`;

const Authortitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
`;

const StarBoxReview = styled.div`
  display: flex;
  align-items: center;
`;

const InfoDetail = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #1e1e1e;
  margin: 1px;
  letter-spacing: 0.5px;　
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
  padding-right: 18px;
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

const MenuImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px 10px 10px 0px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const CollectionBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

function DishDetail(props) {
  const selectedDish = useSelector((state) => state.selectedDish);
  const userStatus = useSelector((state) => state.userStatus);
  const collectionList = useSelector((state) => state.collectionList);

  const collectData = useSelector((state) => state.collectData);
  const userReviewSet = useSelector((state) => state.userReviewSet);

  const dispatch = useDispatch();

  const [allDishReviews, setAllDishReviews] = React.useState(null);
  const [select, selected] = React.useState(false);

  let array = [];
  let newRating = selectedDish.rating.toFixed(1);

  useEffect(() => {
    getAllDishReviews(selectedDish, callback);

    function callback(data) {
      setAllDishReviews(data);
    }
  }, []);

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

        if (data && data.collection && data.collection.length !== 0) {
          let collectionArray = [];
          data.collection.forEach((collect) => {
            if (
              collect.storeCollectionID === selectedDish.storeCollectionID &&
              collect.name === selectedDish.name
            ) {
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

  let reviewsDoms = [];

  if (allDishReviews) {
    allDishReviews.forEach((review, key) => {
      let reviewRatingArray = [];
      let time = new Date(review.time).toISOString().split('T')[0];

      let reviewsDom = (
        <ReviewerBox key={key}>
          <AuthorBox>
            <AuthorImg src={review.userPhotoUrl}></AuthorImg>
            <Authortitle>
              <div>{review.name}</div>
              <P style={{ margin: '4px 0 0 0px' }}>{time}</P>
            </Authortitle>
          </AuthorBox>
          {renderStar(Number(review.rating), reviewRatingArray)}
          <StarBoxReview>
            {reviewRatingArray}
            <P>{review.rating}</P>
          </StarBoxReview>
          <InfoDetail>{review.comment}</InfoDetail>
          {review.imageUrl !== '' ? (
            <MenuImg src={review.imageUrl}></MenuImg>
          ) : (
            <></>
          )}
        </ReviewerBox>
      );

      reviewsDoms.push(reviewsDom);
    });
  }

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
        console.log(e.target.id);
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

  function handleCollectionList(e) {
    console.log(e.target.id);
    dispatch({
      type: 'setCollectionList',
      data: e.target.id
    });
  }

  if (collectData.length > 0) {
    collectData.forEach((data, key) => {
      let collect = (
        <RatingDiv key={key}>
          {data.collectName === '想去的地點' ? (
            <>
              <Icon src="/falg_select.png"></Icon>
              <CollectionBox>
                <Info style={{ fontSize: '15px' }}>
                  已儲存於「{data.collectName}」
                </Info>
                <Info
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    margin: '0px 18px 0 0'
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
                <Info style={{ fontSize: '15px' }}>
                  已儲存於「{data.collectName}」
                </Info>
                <Info
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    margin: '0px 18px 0 0'
                  }}
                  onClick={handleCollectionList}
                  id="喜愛的地點"
                >
                  查看清單
                </Info>
              </CollectionBox>
            </>
          ) : data.collectName === '已加星號的地點' ? (
            <>
              <Icon src="/star_select.png"></Icon>
              <CollectionBox>
                <Info style={{ fontSize: '15px' }}>
                  已儲存於「{data.collectName}」
                </Info>
                <Info
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    margin: '0px 18px 0 0'
                  }}
                  onClick={handleCollectionList}
                  id="已加星號的地點"
                >
                  查看清單
                </Info>
              </CollectionBox>
            </>
          ) : (
            <></>
          )}
        </RatingDiv>
      );
      array.push(collect);
    });
  }

  return (
    <Dish onClick={handleCollectIconClick}>
      {select ? <Collection></Collection> : <></>}
      {selectedDish.imageUrl ? (
        <DishImg src={selectedDish.imageUrl} alt=""></DishImg>
      ) : (
        <WithoutDishImg></WithoutDishImg>
      )}
      <TopDiv>
        <DishBox>
          <DishTitle>{selectedDish.name}</DishTitle>

          <RatingDiv>
            <DishPrice>NT${selectedDish.price}</DishPrice>
            <Icon src="/active_star.png" alt=""></Icon>
            <Info>{newRating}</Info>
          </RatingDiv>
        </DishBox>
        {collectData.length > 0 ? (
          <CollectIcon src="/collected.png" id="collectIcon"></CollectIcon>
        ) : (
          <CollectIcon src="/collect.png" id="collectIcon"></CollectIcon>
        )}
      </TopDiv>

      {collectData.length > 0 ? array : <></>}

      {!userReviewSet ? (
        <CommentBtn type="button" onClick={callModal}>
          評論
        </CommentBtn>
      ) : (
        <EditorBtn type="button" onClick={callModal}>
          編輯
        </EditorBtn>
      )}
      <RatingDiv
        style={{ padding: '24px 0 0 18px', borderBottom: '1px solid #efefef' }}
      >
        <Info style={{ color: 'black', margin: '10px 0 10px 0' }}>評論</Info>
        {allDishReviews ? (
          <Info
            style={{
              color: 'black',
              fontWeight: '600',
              margin: '10px 0px 10px 6px'
            }}
          >
            {allDishReviews.length}
          </Info>
        ) : (
          <InfoBold>0</InfoBold>
        )}
      </RatingDiv>
      {allDishReviews ? reviewsDoms : <NoComment>目前沒有任何評論</NoComment>}
    </Dish>
  );
}

export default DishDetail;
