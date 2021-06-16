import styled from 'styled-components';

import StarRender from '../Utils/StarRender';

import { Content, Description } from './UIComponents/Typography';

const ReviewerBox = styled.div`
  padding: 20px;
  align-items: center;
  flex-irection: 'column';
  border-bottom: ${({ borderBottom }) => (borderBottom ? borderBottom : '1px solid #efefef')};
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

function ReviewCard(props) {
  const { borderBottom, review } = props;
  let time = new Date(review.time).toISOString().split('T')[0];
  const star = StarRender(Number(review.rating), { width: 16, height: 16 });

  return (
    <ReviewerBox borderBottom={borderBottom}>
      <AuthorBox>
        <AuthorImg src={review.userPhotoUrl} />
        <Authortitle>
          <div>{review.name}</div>
          <Description padding={'4px 0 '}>{time}</Description>
        </Authortitle>
      </AuthorBox>

      <StarBoxReview>
        {star}
        <Description padding={'0 0 0 8px'}>{review.rating}</Description>
      </StarBoxReview>
      {review.comment !== '' && <Content padding={'8px 0 12px 0'}>{review.comment}</Content>}
      {review.imageUrl.length > 0 && review.imageUrl.map((url, index) => <MenuImg src={url} key={index} />)}
    </ReviewerBox>
  );
}

export default ReviewCard;
