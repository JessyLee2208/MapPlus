import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { deviceSize } from '../responsive/responsive';
import { Content } from '../Components/UIComponents/Typography';
import { useDispatch } from 'react-redux';

const ToastContainer = styled.div`
  position: absolute;
  top: 90vh;
  //   bottom: 0px;
  left: 500px;
  z-index: 999;
  transition: transform 0.6s ease-in-out;
  animation: toast-in-right 0.7s;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

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

const contentAnimation = [
  { opacity: 0, transform: 'translateY(-50%)' },
  { opacity: 1, transform: 'translateY(-50%)' }
];

const animationSettings = { duration: 250, fill: 'both' };
const reverseAnimationSettings = {
  ...animationSettings,
  direction: 'reverse'
};

// const reverseAnimationSettings = {
//   ...animationSettings,
//   direction: 'reverse'
// };

function Toast(props) {
  const [visible, setVisible] = useState(props.visible || false);
  const contentRef = useRef(null);

  const animateIn = useCallback(() => {
    contentRef.current.animate(contentAnimation, animationSettings);

    setVisible(true);
    timer();
  }, [animationSettings, , contentAnimation]);

  const animateOut = useCallback(async () => {
    await Promise.all([contentRef.current.animate(contentAnimation, reverseAnimationSettings).finished]);
    setVisible(false);
  }, [contentAnimation, reverseAnimationSettings]);

  const timer = () => {
    setTimeout(async () => {
      await animateOut();
      onCancel();

      //   AAAtimer();
    }, 3000);
  };

  //   const AAAtimer = () => {
  //     setTimeout(() => {
  //       onCancel();
  //     }, 6);
  //   };

  // 关闭弹窗
  const onCancel = () => {
    props.onCancel && props.onCancel();
  };

  useEffect(() => {
    if (props.visible) {
      animateIn();
    } else {
      animateOut();
    }
    // return () => {
    //   //   animateOut();
    //   timer();
    //   onCancel();
    // };
  }, [props.visible, animateIn, animateOut]);

  return (
    <ToastContainer>
      <div hidden={!visible}>
        <ToastContent ref={contentRef}>
          {props.children}
          <Content color={'#fff'} onClick={onCancel}>
            關閉
          </Content>
        </ToastContent>
      </div>
    </ToastContainer>
  );
}

export default Toast;
