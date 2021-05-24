import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from './Modal';
import { googleAccountSignIn } from '../Utils/firebase';

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
  margin: 16px 16px 16px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const NormalButton = styled.button`
  background: #ffffff;
  color: #4285f4;
  outline: none;
  font-weight: bold;
  display: inline-block;
  line-height: 36px;
  padding: 2px 20px;
  border-radius: 4px;
  border: 0;
  margin: 16px 0px 16px 16px;
  font-size: 16px;
  cursor: pointer;
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

  return (
    <Modal
      visible={modalShow}
      onCancel={handleClose}
      style={{ padding: '0px' }}
    >
      <TopBackground>
        <Img src="/profile.png" alt=""></Img>
        <Title>登入GOOGLE帳戶即可發表評論</Title>
      </TopBackground>
      <ContentBackground>
        <NormalButton onClick={handleClose}>取消</NormalButton>
        <Button
          onClick={(e) => {
            googleAccountSignIn(e, dispatch);
            handleClose();
          }}
        >
          登入
        </Button>
      </ContentBackground>
    </Modal>
  );
}

export default ReminderModal;
