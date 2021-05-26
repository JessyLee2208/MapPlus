import React, { useEffect } from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';
import { useDispatch, useSelector } from 'react-redux';
import { userReviewGet } from '../Utils/firebase';

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

function MenuCard(props) {
  let starArry = [];
  const [userDatasCheck, setuserDatasCheck] = React.useState(null);

  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);

  let newRating = props.data.rating.toFixed(1);

  useEffect(() => {
    if (userStatus) {
      async function reviewData() {
        let userdata = await userReviewGet(props.data.storeName, userStatus);

        if (userdata) {
          const target = userdata.find(
            (data) =>
              data.storeCollectionID === props.data.storeCollectionID &&
              data.dishName === props.data.name
          );

          target ? setuserDatasCheck(target) : setuserDatasCheck(null);
        }

        // }
      }
      reviewData();
    }
  }, [userStatus]);

  renderStar(props.data.rating, starArry);

  function callModal(e) {
    if (userDatasCheck) {
      dispatch({
        type: 'setUserReviewSet',
        data: userDatasCheck
      });
    } else {
      dispatch({
        type: 'setUserReviewSet',
        data: null
      });
    }

    dispatch({
      type: 'setModalShow',
      data: true
    });

    dispatch({
      type: 'setSelectedDish',
      data: props.data
    });
  }

  return (
    <Menu id={props.data.name}>
      {props.data.imageUrl !== '' ? (
        <MenuImg
          alt=""
          src={props.data.imageUrl}
          id={props.data.name}
        ></MenuImg>
      ) : (
        <NoImg id={props.data.name}></NoImg>
      )}
      {}

      <InfoBox id={props.data.name}>
        <div id={props.data.name}>
          <MenuTitle id={props.data.name}>{props.data.name}</MenuTitle>
          <RatingDiv id={props.data.name}>
            <Info id={props.data.name}>{newRating}</Info>
            {starArry}
          </RatingDiv>
        </div>
        <MenuPrice id={props.data.name}>NT$ {props.data.price}</MenuPrice>
      </InfoBox>
      {!userDatasCheck ? (
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
