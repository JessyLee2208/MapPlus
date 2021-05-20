import React from 'react';
import styled from 'styled-components';
import RenderStar from './RenderStar';
import MenuCard from './MenuCard';
import { useDispatch, useSelector, connect } from 'react-redux';
import { GetMenuReviews } from '../Utils/firebase';

const selectedDish = {
  imageUrl: 'https://d1ralsognjng37.cloudfront.net/5739a5ec-6a96-4ef5-904c-839cc3b07419.jpeg',
  name: '雙層享受牛肉黑麥堡',
  price: 250,
  storeCollectionID: 'ChIJS8TJdhypQjQRS8vJNQ1cFRM',
  storeName: 'miniB 手作漢堡',
  rating: 0,
  user_ratings_total: 0
};
const reviews = [
  {
    name: 'TWM Jessy',
    email: 'jessyleetwm@gmail.com',
    userPhotoUrl: 'https://lh3.googleusercontent.com/a/AATXAJzgPWIpFFpihhTQ4uCwVfkHbsyfXeVOvRH5YT92=s96-c',
    rating: '5',
    comment: '小籠包要快快吃，要不然皮很容易硬/湯汁濃郁 味道中規中矩 對得起價格',
    time: 1621412072924,
    imageUrl: ''
  },
  {
    name: 'TWM Jessy',
    email: 'jessyleetwm@gmail.com',
    userPhotoUrl: 'https://lh3.googleusercontent.com/a/AATXAJzgPWIpFFpihhTQ4uCwVfkHbsyfXeVOvRH5YT92=s96-c',
    rating: '5',
    comment: '小籠包要快快吃，要不然皮很容易硬/湯汁濃郁 味道中規中矩 對得起價格',
    time: 1621412072924,
    imageUrl: ''
  }
];

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
  height: 80px;

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
  height: 2em;
  border-radius: 25px;
  padding: 0.1em 1em;
  font-size: 15px;
  margin-right: 18px;
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
  width: 340px;
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

function DishDetail(props) {
  const selectedDish = useSelector((state) => state.selectedDish);
  const userStatus = useSelector((state) => state.userStatus);
  const dispatch = useDispatch();
  // const reviewsCount = GetMenuReviews(selectedDish);
  const [reviewsData, setReviewsData] = React.useState(null);

  GetMenuReviews(selectedDish).then((res) => {
    if (res.length !== 0) {
      setReviewsData(res);
    }
  });

  let reviewsDoms = [];
  if (reviewsData) {
    reviewsData.forEach((review) => {
      let reviewRatingArray = [];
      let time = new Date(review.time).toISOString().split('T')[0];

      let reviewsDom = (
        <ReviewerBox>
          <AuthorBox>
            <AuthorImg src={review.userPhotoUrl}></AuthorImg>
            <Authortitle>
              <div>{review.name}</div>
              <P style={{ margin: '0px' }}>{time}</P>
            </Authortitle>
          </AuthorBox>
          {RenderStar(Number(review.rating), reviewRatingArray)}
          <StarBoxReview>
            {reviewRatingArray}
            <P>{review.rating}</P>
          </StarBoxReview>
          <InfoDetail>{review.comment}</InfoDetail>
        </ReviewerBox>
      );

      reviewsDoms.push(reviewsDom);
    });
  }

  function callModal(e) {
    if (userStatus) {
      dispatch({
        type: 'setModalShow',
        data: true
      });
    } else {
      console.log('Please login first');
    }
  }
  // function A() {}
  return (
    <Dish>
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
            <Info>{selectedDish.rating}</Info>
          </RatingDiv>
        </DishBox>
        <CommentBtn onClick={callModal}>評論</CommentBtn>
      </TopDiv>

      <RatingDiv style={{ padding: '0px 0 0 18px', borderBottom: '1px solid #efefef' }}>
        <Info style={{ color: 'black' }}>評論</Info>
        {reviewsData ? (
          <Info style={{ color: 'black', fontWeight: '600' }}>{reviewsData.length}</Info>
        ) : (
          <Info style={{ color: 'black', fontWeight: '600' }}>0</Info>
        )}
      </RatingDiv>

      {reviewsData ? reviewsDoms : <NoComment>目前沒有任何評論</NoComment>}
    </Dish>
  );
}

export default DishDetail;
