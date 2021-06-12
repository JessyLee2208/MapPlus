import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from './Modal';
import { googleAccountSignIn } from '../Utils/firebase';
import { ButtonPrimaryFlat, ButtonSecondaryFlat } from './UIComponents/Button';
import toast from 'react-hot-toast';
import { PageTitle, Description } from './UIComponents/Typography';

const ContentBackground = styled.div`
  position: relative;

  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
`;

const ModalContent = styled.div`
  padding: 25px;
`;

function Confim(props) {
  const { title, description } = props;

  const dispatch = useDispatch();
  const modalShow = useSelector((state) => state.modalShow);

  function handleClose() {
    // dispatch({
    //   type: 'setModalShow',
    //   data: false
    // });
    props.control(false);
  }
  const notify = () =>
    toast('成功登出', {
      style: {
        borderRadius: '4px',
        background: '#333',
        color: '#fff'
      }
    });

  return (
    <Modal visible={props.show} onCancel={handleClose} style={{ padding: '0px' }} width={38} left={33}>
      <ModalContent>
        <PageTitle padding={'0'}>{title}</PageTitle>
        <Description padding={'20px 0 0 0'}>{description}</Description>
      </ModalContent>
      <ContentBackground>
        <ButtonSecondaryFlat onClick={handleClose} style={{ margin: '16px 0' }}>
          取消
        </ButtonSecondaryFlat>
        <ButtonPrimaryFlat style={{ margin: '16px' }} onClick={props.onClick}>
          刪除
        </ButtonPrimaryFlat>
      </ContentBackground>
    </Modal>
  );
}

export default Confim;
