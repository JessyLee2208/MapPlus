import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import renderStar from '../Utils/renderStar';
import Modal from './Modal';

import {
  upLoadPhotoToFirebase,
  upLoadReview,
  userReviewEdit
} from '../Utils/firebase';

const ModalTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding: 0px 0 12px 0px;
  border-bottom: 1px solid #efefef;
  margin-bottom: 16px;
`;

const SubTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding: 12px 0 8px 0px;
`;

const Textarea = styled.textarea`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  resize: none;
  border: ' 1px solid #efefef';
  width: 97.2%;
  height: 140px;
  outline: none;
  padding: 8px;
  margin-bottom: 16px;
`;

const Discription = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #757575;
  padding: 8px 0 0px 0px;
`;

const Button = styled.button`
  background: #4285f4;
  color: #fff;
  outline: none;
  font-weight: bold;
  display: inline-block;
  line-height: 36px;
  padding: 2px 20px;
  border-radius: 4px;
  border: 0;
  margin: 0 0px 0px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin: 0px 0px 0px 12px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const ModalContent = styled.div`
  padding: 25px;
`;

function CommentModal({ show }) {
  const dispatch = useDispatch();
  let starArry = [];
  const userStatus = useSelector((state) => state.userStatus);
  const DishData = useSelector((state) => state.selectedDish);
  const userReviewSet = useSelector((state) => state.userReviewSet);
  const modalShow = useSelector((state) => state.modalShow);

  const [starRating, setStarRating] = React.useState(0);
  const [commentValue, setCommentValue] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');

  function handleClose() {
    dispatch({
      type: 'setModalShow',
      data: false
    });
  }
  useEffect(() => {
    if (userReviewSet) {
      setStarRating(userReviewSet.rating);
      setImgUrl(userReviewSet.imageUrl);
    }
  }, [userReviewSet]);

  renderStar(starRating, starArry);

  function handleStarRating(e) {
    setStarRating(e.target.id);
  }

  const bindUploadPhotoBtn = async (e) => {
    const url = await upLoadPhotoToFirebase(e);
    setImgUrl(url);
  };

  function bindupLoadReview() {
    const datetime = new Date().getTime();
    const ReviewData = {
      name: userStatus.displayName,
      email: userStatus.email,
      userPhotoUrl: userStatus.photoURL,
      rating: starRating,
      comment: commentValue,
      time: datetime,
      imageUrl: imgUrl
    };
    if (!userReviewSet) {
      upLoadReview(ReviewData, DishData).then((res) => {
        dispatch({
          type: 'upDateMenuData',
          data: res
        });

        dispatch({
          type: 'upDateSelectMenuData',
          data: res
        });
      });
    } else {
      userReviewEdit(userReviewSet, ReviewData);
    }

    handleClose();
  }

  function handleInputChange(e) {
    setCommentValue(e.target.value);
  }
  const ref = React.useRef();

  function handleInputClick() {
    ref.current.click();
  }
  console.log(DishData);

  return (
    <>
      <Modal visible={modalShow} onCancel={handleClose}>
        <ModalContent>
          <ModalTitle>
            {DishData.name}
            <Discription>店家：{DishData.storeName}</Discription>
          </ModalTitle>
          <div>{userStatus.displayName}</div>
          <div onClick={handleStarRating}>{starArry}</div>

          <SubTitle>我要留言</SubTitle>
          {!userReviewSet ? (
            <Textarea
              rows={3}
              placeholder="分享你的心得或感想"
              onChange={handleInputChange}
            ></Textarea>
          ) : (
            <Textarea rows={3} onChange={handleInputChange}>
              {userReviewSet.comment}
            </Textarea>
          )}

          <input
            type="file"
            accept="image/gif,image/jpeg, image/png"
            onChange={bindUploadPhotoBtn}
            ref={ref}
            style={{ display: 'none' }}
          ></input>
          <img
            src="/uploadbtn.png"
            alt=""
            style={{ border: ' 1px solid #D0D0D0', borderRadius: '6px' }}
            onClick={handleInputClick}
          ></img>
          {imgUrl ? <Img src={imgUrl}></Img> : <></>}
          <Footer>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={bindupLoadReview}>評論</Button>
          </Footer>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentModal;
