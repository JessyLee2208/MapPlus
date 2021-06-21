import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Modal from './Modal';
import { ButtonPrimaryFlat, ButtonDisableFlat } from './UIComponents/Button';
import { PageTitle, Description, AlertText } from './UIComponents/Typography';
import useMediaQuery from '../useHook/useMediaQuery';
import { addCollectList } from '../Utils/firebase';
import { addListNotify } from '../Utils/toasts';
import { deviceSize } from '../properties/properties';

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
  transition: all 100ms ease-in-out;
  outline: none;
  padding: 8px;
  margin: 8px 0;

  :focus {
    border: 1px solid #4285f4;
  }
`;

function AddCollectionModal(props) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);
  const userStatus = useSelector((state) => state.userStatus);
  const customList = useSelector((state) => state.customList);

  const [nameCheck, setNameCheck] = useState(false);
  const [inputText, setInputText] = useState('');

  let listInputRef = null;

  useEffect(() => {
    if (listInputRef) {
      listInputRef.focus();
    }
  }, [listInputRef]);

  function handleClose() {
    props.check(false);
  }

  function handleInputCheck(e) {
    setInputText(e.target.value);
    let inputCheck = [];
    if (customList) {
      customList.forEach((list) => {
        if (e.target.value === list) {
          inputCheck.push(true);
        } else if (e.target.value !== list) {
          inputCheck.push(false);
        }
        let valeu = inputCheck.findIndex((check) => check === true);

        if (valeu !== -1) {
          setNameCheck(true);
        } else {
          setNameCheck(false);
        }
      });
    }
  }

  function bindupLoadCollection() {
    addCollectList(userStatus.email, inputText).then(() => {
      dispatch({
        type: 'updateCustomList',
        data: inputText
      });
      props.check(false);
      addListNotify();
    });
  }

  return (
    <Modal visible={props.show} onCancel={handleClose} style={{ padding: '0px' }} width={46} left={30}>
      <ModalContent>
        <PageTitle padding={'0 0 20px 0'}>新增清單</PageTitle>
        <ContentBackground>
          <Description>清單名稱</Description>
          <Description>{inputText.length}/40</Description>
        </ContentBackground>

        <Input
          onChange={handleInputCheck}
          type="text"
          maxLength="40"
          ref={(elem) => (listInputRef = elem)}
          style={{ borderColor: nameCheck && '#ff1b1b' }}
        ></Input>
        <AlertText style={{ color: nameCheck ? '#ff1b1b' : '#fff' }}> 已有相同名稱的收藏清單 </AlertText>
        <AlertText> </AlertText>
        <ContentBackSet>
          {inputText.length > 0 && !nameCheck ? (
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

export default AddCollectionModal;
