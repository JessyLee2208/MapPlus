import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import renderStar from '../Utils/renderStar';
import {
  upLoadPhotoToFirebase,
  upLoadReview,
  userReviewEdit
} from '../Utils/firebase';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin: 0px 0px 0px 12px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

function ModalControl({ show, data }) {
  const dispatch = useDispatch();
  let starArry = [];
  const userStatus = useSelector((state) => state.userStatus);
  const DishData = useSelector((state) => state.selectedDish);
  const userReviewSet = useSelector((state) => state.userReviewSet);

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
    setStarRating(userReviewSet.rating);
    setImgUrl(userReviewSet.imageUrl);
  }, [userReviewSet]);

  // if (!userReviewSet) {
  //   setStarRating(0);
  // } else {
  //   ;
  // }
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

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: 'center' }}>
            {DishData.name}
          </Modal.Title>
        </Modal.Header>

        <Container style={{ padding: '16px 18px' }}>
          <Row>
            <Col>{userStatus.displayName}</Col>
          </Row>

          <Row>
            <Col onClick={handleStarRating}>{starArry}</Col>
          </Row>
        </Container>

        <Form style={{ padding: '0 18px' }}>
          <Form.Group controlId="formPlaintextEmail">
            <Form.Label>我要留言</Form.Label>
            {!userReviewSet ? (
              <Form.Control
                as="textarea"
                rows={3}
                style={{ resize: 'none', border: ' 1px solid #000000' }}
                placeholder="分享你的心得或感想"
                onChange={handleInputChange}
              />
            ) : (
              <Form.Control
                as="textarea"
                rows={3}
                style={{ resize: 'none', border: ' 1px solid #000000' }}
                onChange={handleInputChange}
              >
                {userReviewSet.comment}
              </Form.Control>
            )}
          </Form.Group>
        </Form>
        <Modal.Body style={{ padding: '0 18px' }}>
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
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', paddingTop: '10px' }}>
          <Button onHide={handleClose}>取消</Button>
          <Button onClick={bindupLoadReview}>評論</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalControl;
