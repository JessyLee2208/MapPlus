import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccessnNotify } from '../Utils/toasts';
import { googleAccountSignIn } from '../Utils/firebase';
import { ButtonPrimaryFlat } from './UIComponents/Button';
import useMediaQuery from '../Utils/useMediaQuery';
import { deviceSize } from '../properties/properties';

const AuthorImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  position: fixed;
  right: 47px;
  top: 11px;

  cursor: pointer;

  &:hover {
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.15);
  }

  @media screen and (max-width: ${deviceSize.mobile}px) {
    position: fixed;
    right: 18px;
    top: 15px;
    z-index: 4;
    width: 44px;
    height: 44px;
  }
`;

const loginBtnStyle = {
  mobileStyle: {
    position: 'fixed',
    right: '20px',
    top: '18px',
    zIndex: '4'
  },
  webStyle: {
    position: 'fixed',
    right: '62px',
    top: '11px'
  }
};

function LoginState(props) {
  const { setMemberPageShow, memberPageShow } = props;
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);

  const userStatus = useSelector((state) => state.userStatus);
  useEffect(() => {
    if (userStatus) {
      loginSuccessnNotify();
    }
  }, [userStatus]);

  const handleLoginButtonCilck = (e) => {
    googleAccountSignIn(e, dispatch, setMemberPageShow);
    dispatch({
      type: 'setloginToast',
      data: true
    });
  };

  function onUserProfileClickHandler() {
    setMemberPageShow(!memberPageShow);
    dispatch({
      type: 'setMarkerHover',
      data: null
    });
  }

  return userStatus ? (
    <AuthorImg src={userStatus.photoURL} alt="" onClick={onUserProfileClickHandler} />
  ) : (
    <ButtonPrimaryFlat
      onClick={handleLoginButtonCilck}
      style={!isMobile ? loginBtnStyle.webStyle : loginBtnStyle.mobileStyle}
    >
      登入
    </ButtonPrimaryFlat>
  );
}

export default LoginState;
