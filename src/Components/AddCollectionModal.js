import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from './Modal';
import useMediaQuery from '../Utils/useMediaQuery';
import { addCollectList } from '../Utils/firebase';
import { ButtonPrimaryFlat, ButtonDisableFlat } from './UIComponents/Button';
import toast from 'react-hot-toast';
import { PageTitle, SubTitle, Description, Content } from './UIComponents/Typography';
import { deviceSize } from '../responsive/responsive';

const ContentBackground = styled.div`
  position: relative;

  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
`;

const ContentBackSet = styled.div`
  position: relative;

  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ModalContent = styled.div`
  padding: 25px;
`;

const Input = styled.input`
  font-family: Roboto, Noto Sans TC, Arial, sans-serif;
  border: 1px solid #000000;
  border-radius: 2px;
  font-size: 16px;
  resize: none;

  width: calc(100% - 20px);

  outline: none;
  padding: 8px;
  margin: 8px 0 20px 0;

  :focus {
    border: 1px solid #4285f4;
  }
`;

function ReminderModal(props) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);
  const userStatus = useSelector((state) => state.userStatus);
  const modalShow = useSelector((state) => state.modalShow);
  const [inputText, setInputText] = React.useState('');

  function handleClose() {
    props.check(false);
    dispatch({
      type: 'setModalShow',
      data: false
    });
  }

  function handleInputCheck(e) {
    setInputText(e.target.value);
  }

  function bindupLoadCollection() {
    console.log('???');
    addCollectList(userStatus.email, inputText).then(() => {
      console.log('upload work!!!');
    });
  }

  return (
    <Modal visible={modalShow} onCancel={handleClose} style={{ padding: '0px' }} width={46} left={30}>
      <ModalContent>
        <PageTitle padding={'0 0 20px 0'}>新增清單</PageTitle>
        <ContentBackground>
          <Description>清單名稱</Description>
          <Description>{inputText.length}/40</Description>
        </ContentBackground>

        <Input onChange={handleInputCheck} type="text" maxLength="40"></Input>
        <ContentBackSet>
          {inputText.length > 0 ? (
            <ButtonPrimaryFlat style={{ width: isMobile ? '100%' : 'auto' }} onClick={bindupLoadCollection}>
              建立
            </ButtonPrimaryFlat>
          ) : (
            <ButtonDisableFlat style={{ width: isMobile ? '100%' : 'auto' }}>建立</ButtonDisableFlat>
          )}
        </ContentBackSet>
      </ModalContent>
    </Modal>
  );
}

export default ReminderModal;
