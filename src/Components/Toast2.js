import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { deviceSize } from '../responsive/responsive';
import { Content } from '../Components/UIComponents/Typography';

const ToastContent = styled.article`
  background-color: #323232;
  display: flex;
  border-radius: 8px;
  width: calc(80vw - 435px);
  //   max-height: 80%;
  padding: 17px 20px;
  box-sizing: border-box;
  overflow: auto;
  color: #fff;
  justify-content: space-between;
  opacity: 0.8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    left: 0;
    top: 50%;
    border-radius: 0;
  }
`;

const animationFidIn = keyframes`
  0%{
    opacity: 0;
    transform: 'translateY(100%)'
  }
  100%{
    opacity: 1;
    transform: 'translateY(0%)'
  }

`;

const animationFidOut = keyframes`
  0%{
    opacity: 1;
    transform: 'translateY(100%)'
  }
  100%{
    opacity: 0;
    transform: 'translateY(0%)'
  }

`;

function Toast2(props) {
  const [inProp, setInProp] = useState(true);

  const ToastContainer = styled.div`
    position: absolute;
    top: 90vh;

    left: 500px;
    z-index: 999;
    // transition: transform 0.6s ease-in-out;
    animation-name: ${inProp ? animationFidIn : animationFidOut};
    animation-duration: 1s;
    // animation: ${inProp ? animationFidIn : 'none'};
    @media screen and (max-width: ${deviceSize.mobile}px) {
      width: 100vw;
    }
  `;
  useEffect(() => {
    if (props.visible) {
      timerIn();
    } else {
      onCancel();
    }
  }, [props.visible]);

  const timerIn = () => {
    setTimeout(() => {
      setInProp(false);
    }, 2000);
    setTimeout(() => {
      onCancel();
    }, 2800);
  };

  const onCancel = () => {
    props.onCancel && props.onCancel();
  };

  return (
    props.visible && (
      <ToastContainer>
        <ToastContent>
          {props.children}
          <Content color={'#fff'} onClick={onCancel} style={{ cursor: 'pointer' }}>
            關閉
          </Content>
        </ToastContent>
      </ToastContainer>
    )
  );
}
export default Toast2;
