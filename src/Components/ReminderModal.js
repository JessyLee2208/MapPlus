import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Modal from './Modal';
import { googleAccountSignIn } from '../Utils/firebase';
import { ButtonPrimaryFlat, ButtonSecondaryFlat } from './UIComponents/Button';

const TopBackground = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  background: #4285f4;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ContentBackground = styled.div`
  position: relative;

  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
`;

const Title = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;

  text-align: center;
`;

const Img = styled.img`
  width: 120px;
  height: 120px;
  padding: 80px 20px 20px 20px;
`;

function ReminderModal() {
  const dispatch = useDispatch();
  const modalShow = useSelector((state) => state.modalShow);

  function handleClose() {
    dispatch({
      type: 'setModalShow',
      data: false
    });
  }

  const onClickHandler = (e) => {
    googleAccountSignIn(e, dispatch);
    dispatch({
      type: 'setlogOutToast',
      data: true
    });
    dispatch({
      type: 'setloginToast',
      data: true
    });
    handleClose();
  };

  return (
    <Modal visible={modalShow} onCancel={handleClose} style={{ padding: '0px' }}>
      <TopBackground>
        <Img src="/profile.png" alt="" />
        <Title>登入GOOGLE帳戶即可發表評論</Title>
      </TopBackground>
      <ContentBackground>
        <ButtonSecondaryFlat onClick={handleClose} style={{ margin: '16px 0' }}>
          取消
        </ButtonSecondaryFlat>
        <ButtonPrimaryFlat style={{ margin: '16px' }} onClick={onClickHandler}>
          登入
        </ButtonPrimaryFlat>
      </ContentBackground>
    </Modal>
  );
}

export default ReminderModal;
