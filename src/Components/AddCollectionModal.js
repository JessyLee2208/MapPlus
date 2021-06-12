import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from './Modal';
import useMediaQuery from '../Utils/useMediaQuery';
import { addCollectList } from '../Utils/firebase';
import { ButtonPrimaryFlat, ButtonDisableFlat } from './UIComponents/Button';
import toast from 'react-hot-toast';
import { PageTitle, Description, AlertText } from './UIComponents/Typography';
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
  let text = '&nbsp;';

  let listInputRef = null;

  useEffect(() => {
    if (listInputRef) {
      listInputRef.focus();
    }
  }, [listInputRef]);

  const [inputText, setInputText] = React.useState('');

  function handleClose() {
    props.check(false);
  }

  function handleInputCheck(e) {
    setInputText(e.target.value);
    let inputCheck = [];
    customList.forEach((list) => {
      if (e.target.value === list) {
        inputCheck.push(true);
      } else if (e.target.value !== list) {
        inputCheck.push(false);
      }
      let valeu = inputCheck.findIndex((check) => check === true);

      if (valeu !== -1) {
        console.log(valeu);
        setNameCheck(true);
      } else {
        setNameCheck(false);
      }
    });
    //
  }

  console.log(customList);

  function bindupLoadCollection() {
    addCollectList(userStatus.email, inputText).then(() => {
      props.check(false);

      dispatch({
        type: 'updateCustomList',
        data: inputText
      });
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
          style={{ borderColor: nameCheck ? '#ff1b1b' : '#000000' }}
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
