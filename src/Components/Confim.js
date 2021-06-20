import React from 'react';

import styled from 'styled-components';
import Modal from './Modal';

import { ButtonPrimaryFlat, ButtonSecondaryFlat } from './UIComponents/Button';

import { PageTitle, Description } from './UIComponents/Typography';
import { deleteListNotify } from '../utils/toasts';

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

  function handleClose() {
    props.control(false);
  }

  const handleDeleteButton = () => {
    props.onClick();
    deleteListNotify();
  };

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
        <ButtonPrimaryFlat style={{ margin: '16px' }} onClick={handleDeleteButton}>
          刪除
        </ButtonPrimaryFlat>
      </ContentBackground>
    </Modal>
  );
}

export default Confim;
