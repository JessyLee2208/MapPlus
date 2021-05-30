import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { deviceSize } from '../responsive/responsive';

const ModalContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 6;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0;
`;

const ModalContent = styled.article`
  position: fixed;
  top: 50%;
  left: 15%;
  background-color: white;
  border-radius: 8px;
  width: 70%;
  max-height: 80%;
  // padding: 25px;
  box-sizing: border-box;
  overflow: auto;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    left: 0;
    top: 50%;
    border-radius: 0;
  }
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 22px;
  cursor: pointer;
  font-size: 24px;
`;

const contentAnimation = [
  { opacity: 0, transform: 'translateY(-30%)' },
  { opacity: 1, transform: 'translateY(-50%)' }
];
const overlayAnimation = [{ opacity: 0 }, { opacity: 0.3 }];
const animationSettings = { duration: 150, fill: 'both' };
const reverseAnimationSettings = {
  ...animationSettings,
  direction: 'reverse'
};

function Modal(props) {
  const [visible, setVisible] = useState(props.visible || false);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const animateIn = useCallback(() => {
    contentRef.current.animate(contentAnimation, animationSettings);
    overlayRef.current.animate(overlayAnimation, animationSettings);
    setVisible(true);
  }, [animationSettings, overlayAnimation, contentAnimation]);

  const animateOut = useCallback(async () => {
    await Promise.all([
      contentRef.current.animate(contentAnimation, reverseAnimationSettings).finished,
      overlayRef.current.animate(overlayAnimation, reverseAnimationSettings).finished
    ]);
    setVisible(false);
  }, [contentAnimation, overlayAnimation, reverseAnimationSettings]);

  const onCancel = () => {
    props.onCancel && props.onCancel();
  };

  useEffect(() => {
    if (props.visible) {
      animateIn();
    } else {
      animateOut();
    }
  }, [props.visible, animateIn, animateOut]);

  return (
    <ModalContainer>
      <div hidden={!visible}>
        <Overlay ref={overlayRef} onClick={onCancel} />
        <ModalContent ref={contentRef}>
          {props.children}
          <CloseButton onClick={onCancel}>×</CloseButton>
        </ModalContent>
      </div>
    </ModalContainer>
  );
}

export default Modal;
