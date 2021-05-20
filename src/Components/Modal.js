import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import React from 'react';
import renderStar from '../Utils/renderStar';
import { upLoadPhotoToFirebase, upLoadReview, getMenuReviews } from '../Utils/firebase';
import { useSelector } from 'react-redux';

function ModalControl({ show, data }) {
  const dispatch = useDispatch();
  let starArry = [];
  const userStatus = useSelector((state) => state.userStatus);
  const DishData = useSelector((state) => state.selectedDish);

  const [starRating, setStarRating] = React.useState(0);
  const [commentValue, setCommentValue] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');

  function handleClose() {
    dispatch({
      type: 'setModalShow',
      data: false
    });
  }

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

    handleClose();
  }

  function handleInputChange(e) {
    setCommentValue(e.target.value);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: 'center' }}>{DishData.name}</Modal.Title>
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
            <Form.Control
              as="textarea"
              rows={3}
              style={{ resize: 'none', border: ' 1px solid #000000' }}
              placeholder="分享你的心得或感想"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
        <Modal.Body style={{ padding: '0 18px' }}>
          <input type="file" accept="image/gif,image/jpeg, image/png" onChange={bindUploadPhotoBtn}></input>
          {/* {uploadBtn} */}
          <img
            src="/uploadbtn.png"
            alt=""
            style={{ border: ' 1px solid #D0D0D0', borderRadius: '6px' }}
            onClick={bindUploadPhotoBtn}
          ></img>
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
