import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import StarRender from '../Utils/StarRender';
import Modal from './Modal';
import { ButtonPrimaryFlat, ButtonDisableFlat } from './UIComponents/Button';
import { PageTitle, SubTitle, Description, Content } from './UIComponents/Typography';
import { upLoadPhotoToFirebase, upLoadReview, userReviewEdit } from '../Utils/firebase';
import useMediaQuery from '../Utils/useMediaQuery';
import { deviceSize } from '../properties/properties';
import { commentSuccessnNtify, editSuccessNotify } from '../Utils/toasts';

const Separator = styled.div`
  width: auto;
  min-height: 1px;
  background: #efefef;
  margin: 14px 0 16px 0;
`;

const Textarea = styled.textarea`
  font-family: Roboto, Noto Sans TC, Arial, sans-serif;
  font-size: 16px;
  resize: none;

  width: calc(100% - 20px);
  height: 120px;
  outline: none;
  padding: 8px;
  margin-bottom: 10px;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  padding: 6px 0 0 0;
`;

const Div = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  // padding: 6px 0 0 0;
  position: relative;
`;

const Delete = styled.div`
  background: #fff;
  opacity: 0.8;
  width: 20px;
  height: 20px;
  position: relative;
  top: -24px;
  right: -67px;
  border-radius: 20px;
  box-shadow: 0 0px 5px rgb(0 0 0 / 26%);

  z-index: 2;
  text-align: center;
  line-height: 18px;

  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    justify-content: center;
    display: flex;
    padding-top: 40px;
  }
`;

const UpLoadImg = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: all 150ms ease-in-out;
  border: 1px solid #d0d0d0;

  &:hover {
    background: #fbfbfb;
    border: 1px solid #1973e8;
  }

  img {
    width: 76%;
    height: 76%;
    object-fit: cover;
  }
`;

const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  // margin: 0px 0px 0px 12px;

  flex-shrink: 1;
`;

const ModalContent = styled.div`
  padding: 25px;
`;

function CommentModal({ show }) {
  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);

  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.userStatus);
  const DishData = useSelector((state) => state.selectedDish);
  const userReviewSet = useSelector((state) => state.userReviewSet);
  const modalShow = useSelector((state) => state.modalShow);

  const [starRating, setStarRating] = useState(0);
  const [commentValue, setCommentValue] = useState('');
  const [imgUrl, setImgUrl] = useState([]);

  const star = StarRender(starRating, { width: 26, height: 26 });

  function handleClose() {
    dispatch({
      type: 'setModalShow',
      data: false
    });
  }
  useEffect(() => {
    if (userReviewSet) {
      setStarRating(userReviewSet.rating);
      setCommentValue(userReviewSet.comment);
      setImgUrl(userReviewSet.imageUrl);
    }
  }, [userReviewSet]);

  function handleStarRating(e) {
    if (e.target.id !== '') {
      setStarRating(e.target.id);
    }
  }

  function handlePhotoDelete(e) {
    const target = e.target.id;

    let newPhotoArray = [...imgUrl];
    newPhotoArray.splice(target, 1);

    setImgUrl(newPhotoArray);
  }

  const bindUploadPhotoBtn = async (e) => {
    const url = upLoadPhotoToFirebase(e);

    Promise.all(url).then((res) => {
      let newPhotoArray = [...imgUrl];

      newPhotoArray.push(...res);
      setImgUrl(newPhotoArray);
    });
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
        dispatch({
          type: 'upDateSearchMenu',
          data: res
        });
        commentSuccessnNtify();
      });
    } else {
      let oldRating = userReviewSet.rating;
      userReviewEdit(userReviewSet, ReviewData, oldRating).then((res) => {
        dispatch({
          type: 'upDateSelectMenuData',
          data: res
        });

        dispatch({
          type: 'upDateSearchMenu',
          data: res
        });
        editSuccessNotify();
      });
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

  return (
    <>
      <Modal visible={modalShow} onCancel={handleClose}>
        <ModalContent>
          <PageTitle padding={'0'}>{DishData.name}</PageTitle>
          <Description padding={'4px 0 0 0'}>店家：{DishData.storeName}</Description>
          <Separator></Separator>
          <Content>{userStatus.displayName}</Content>
          <RatingDiv onClick={handleStarRating}>{star}</RatingDiv>

          <SubTitle padding={'0 0 6px 0'}>我要留言</SubTitle>

          <Textarea
            rows={3}
            placeholder="分享你的心得或感想"
            onChange={handleInputChange}
            value={commentValue}
          ></Textarea>

          <input
            type="file"
            accept="image/gif,image/jpeg, image/png"
            onChange={bindUploadPhotoBtn}
            ref={ref}
            style={{ display: 'none' }}
            multiple
          ></input>
          <RatingDiv>
            <UpLoadImg style={{ borderRadius: '6px' }} onClick={handleInputClick}>
              <img src="/uploadbtn.png" alt=""></img>
            </UpLoadImg>
            {imgUrl
              ? imgUrl.map((url, index) => (
                  <Div key={index}>
                    <Delete onClick={handlePhotoDelete} id={index}>
                      ×
                    </Delete>
                    <Img src={url} alt=""></Img>
                  </Div>
                ))
              : null}
          </RatingDiv>

          <Footer>
            <ButtonPrimaryFlat onClick={handleClose} style={{ width: isMobile ? '100%' : 'auto' }}>
              取消
            </ButtonPrimaryFlat>
            {starRating > 0 ? (
              <ButtonPrimaryFlat
                onClick={bindupLoadReview}
                style={{ marginLeft: '16px', width: isMobile ? '100%' : 'auto' }}
              >
                評論
              </ButtonPrimaryFlat>
            ) : (
              <ButtonDisableFlat style={{ marginLeft: '16px', width: isMobile ? '100%' : 'auto' }}>
                評論
              </ButtonDisableFlat>
            )}
          </Footer>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentModal;
