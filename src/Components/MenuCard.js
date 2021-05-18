import React from 'react';
import styled from 'styled-components';
import RenderStar from './RenderStar';
import { useDispatch, useSelector } from 'react-redux';
import { userReviewCheck } from '../Utils/firebase';

const Menu = styled.div`
  background: #ffffff;
  width: 100%;

  display: flex;
  margin: 10px 0;
  align-items: center;
  //
`;

const MenuImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px 10px 10px 18px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
  //   background: #f0f0f0;
`;

const NoImg = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin: 10px 10px 10px 18px;
  text-align: right;
  flex-shrink: 1;

  background: #f0f0f0;
`;

const MenuTitle = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #1e1e1e;
  margin: 0;
  padding-bottom: 6px;
  width: 224px;
`;
const MenuPrice = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #185ee6;
  margin: 0;
`;
const InfoBox = styled.div`
  display: block;
  padding: 0px 0 0px 8px;
  flex-direction: column;

  flex-grow: 2;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  padding-bottom: 18px;
`;
const Info = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #5d6267;
  margin: 1px 4px 0 0;
`;

const CommentBtn = styled.button`
  border: 1px solid #185ee6;
  background: #fff;
  color: #185ee6;
  //   width: 64px;
  height: 2em;
  border-radius: 25px;
  padding: 0.1em 1em;
  font-size: 15px;

  margin-right: 20px;
`;

const EditorBtn = styled.button`
  border: 1px solid #4285f4;
  background: #4285f4;
  color: #fff;
  //   width: 64px;
  height: 2em;
  border-radius: 25px;
  padding: 0.1em 1em;
  font-size: 15px;

  margin-right: 20px;
`;

const product = {
  imageUrl: 'https://d1ralsognjng37.cloudfront.net/5739a5ec-6a96-4ef5-904c-839cc3b07419.jpeg',
  name: '雙層享受牛肉黑麥堡',
  price: 250,
  storeCollectionID: 'ChIJS8TJdhypQjQRS8vJNQ1cFRM',
  storeName: 'miniB 手作漢堡',
  rating: 0,
  user_ratings_total: 0
};

function MenuCard(props) {
  let starArry = [];
  const [userReviewSet, setUserReviewSet] = React.useState(undefined);
  //   const show = useSelector((state) => state.modalShow);
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);

  if (userStatus) {
    userReviewCheck(userStatus).then((res) => {
      if (res.reviews.length !== 0) {
        const target = res.reviews.find(
          (recoom) => recoom.storeCollectionID === props.data.storeCollectionID && recoom.dishName === props.data.name
        );
        setUserReviewSet(target);
      }
    });
  }

  RenderStar(props.data.rating, starArry);

  // const show = useSelector((state) => state.modalShow);
  // const tab = useSelector((state) => state.selectedTab);

  function callModal(e) {
    if (userStatus) {
      dispatch({
        type: 'setModalShow',
        data: true
      });

      dispatch({
        type: 'setSelectedDish',
        data: props.data
      });
    } else {
      console.log('Please login first');
    }

    // console.log(props.data);
    // console.log(tab);
  }

  return (
    <Menu>
      {props.data.imageUrl !== '' ? <MenuImg alt="" src={props.data.imageUrl}></MenuImg> : <NoImg></NoImg>}
      {}

      <InfoBox>
        <div>
          <MenuTitle>{props.data.name}</MenuTitle>
          <RatingDiv>
            <Info>{props.data.rating}</Info>
            {starArry}
            {/* <Info>({props.data.user_ratings_total})</Info> */}
          </RatingDiv>
        </div>
        <MenuPrice>NT$ {props.data.price}</MenuPrice>
      </InfoBox>
      {userReviewSet === undefined ? (
        <CommentBtn type="button" onClick={callModal}>
          評論
        </CommentBtn>
      ) : (
        <EditorBtn type="button" onClick={callModal}>
          編輯
        </EditorBtn>
      )}
    </Menu>
  );
}

export default MenuCard;
