import styled from 'styled-components';
import renderStar from '../Utils/renderStar';

const ReviewerBox = styled.div`
  padding: 8px 16px 18px 18px;
  align-items: center;
  flex-irection: 'column';
  //   border-bottom: 1px solid #efefef;
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

const MenuImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px 10px 10px 0px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
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

function ReviewCard(props) {
  let reviewRatingArray = [];
  let time = new Date(props.review.time).toISOString().split('T')[0];

  return (
    <ReviewerBox>
      <AuthorBox>
        <AuthorImg src={props.review.userPhotoUrl}></AuthorImg>
        <Authortitle>
          <div>{props.review.name}</div>
          <P style={{ margin: '4px 0 0 0px' }}>{time}</P>
        </Authortitle>
      </AuthorBox>
      {renderStar(Number(props.review.rating), reviewRatingArray)}
      <StarBoxReview>
        {reviewRatingArray}
        <P>{props.review.rating}</P>
      </StarBoxReview>
      <InfoDetail>{props.review.comment}</InfoDetail>
      {props.review.imageUrl !== '' ? (
        <MenuImg src={props.review.imageUrl}></MenuImg>
      ) : (
        <></>
      )}
    </ReviewerBox>
  );
}

export default ReviewCard;
