import styled from 'styled-components';
import renderStar from '../Utils/renderStar';
import { Content, Description } from './UIComponents/Typography';

const ReviewerBox = styled.div`
  padding: 20px;
  align-items: center;
  flex-irection: 'column';
  border-bottom: 1px solid #efefef;
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 0 10px 0;
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
  // margin: 10px 10px 10px 0px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
  margin-right: 10px;
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
  console.log(props.review);

  return (
    <ReviewerBox>
      <AuthorBox>
        <AuthorImg src={props.review.userPhotoUrl}></AuthorImg>
        <Authortitle>
          <div>{props.review.name}</div>
          <Description padding={'4px 0 '}>{time}</Description>
        </Authortitle>
      </AuthorBox>
      {renderStar(Number(props.review.rating), reviewRatingArray)}
      <StarBoxReview>
        {reviewRatingArray}
        <Description padding={'0 0 0 8px'}>{props.review.rating}</Description>
      </StarBoxReview>
      <Content padding={'8px 0 12px 0'}>{props.review.comment}</Content>
      {props.review.imageUrl.length > 0 ? (
        props.review.imageUrl.map((url) => <MenuImg src={url}></MenuImg>)
      ) : (
        <></>
      )}
    </ReviewerBox>
  );
}

export default ReviewCard;
