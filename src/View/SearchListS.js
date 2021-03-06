import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import StoreCardS from '../Components/StoreCardS';
import { useSelector, useDispatch } from 'react-redux';
import { deviceSize } from '../properties/properties';

const UserPositionCheck = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 97px;
  z-index: 4;
  background: #fff;

  cursor: pointer;
  transition: all 150ms ease-in-out;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  img {
    width: 60%;
    height: 60%;
    object-fit: cover;
  }
  @media screen and (max-width: ${deviceSize.mobile}px) {
    display: none;
  }
`;

const InformationBoxS = styled.div`
  background: #ffffff;
  width: calc(100vw - 455px);
  position: absolute;
  left: 435px;
  // height:200px
  bottom: 0;
  z-index: -5;
  display: flex;
  overflow: auto;
  padding: 0 10px;
`;

const DicContainer = styled.div`
  // &:hover {
  //   & .button {
  //     diaplay: flex;
  //   }
  // }
`;

function SearchListS(props) {
  const { service } = props;
  const storeData = useSelector((state) => state.storeData);
  const myRef = useRef(null);
  const [scrollXLeft, setScrollXLeft] = useState(null);
  const [scrollXRight, setScrollXRight] = useState(null);
  const [iconShow, setIconShow] = useState(false);
  const dispatch = useDispatch();

  const executeScrollRight = () => {
    myRef.current.scrollBy({ left: 175, top: 0, behavior: 'smooth' });
    const loction = myRef.current.scrollLeft + 175;
    const loctionRight = storeData.length * 175 - loction - window.innerWidth;

    setScrollXLeft(loction);
    setScrollXRight(loctionRight);
  };
  const executeScrollLeft = () => {
    myRef.current.scrollBy({ left: -175, top: 0, behavior: 'smooth' });
    const loction = myRef.current.scrollLeft - 175;
    const loctionRight = storeData.length * 175 - loction - window.innerWidth;

    setScrollXLeft(loction);
    setScrollXRight(loctionRight);
  };

  function handleHoverEvent(e) {
    if (!iconShow) {
      setIconShow(true);
    }
    dispatch({
      type: 'setMarkerHover',
      data: null
    });
  }
  function handleHoverOutEvent() {
    if (iconShow) {
      setIconShow(false);
    }
  }

  return (
    <DicContainer onMouseOver={handleHoverEvent} onMouseOut={handleHoverOutEvent}>
      {(!scrollXRight || scrollXRight > -415) && (
        <UserPositionCheck onClick={executeScrollRight} style={{ right: '8px', display: iconShow ? 'flex' : 'none' }}>
          <img src="/right.png" alt="" />
        </UserPositionCheck>
      )}

      {scrollXLeft && scrollXLeft > 0 ? (
        <UserPositionCheck onClick={executeScrollLeft} style={{ left: '444px', display: iconShow ? 'flex' : 'none' }}>
          <img src="/left.png" alt="" />
        </UserPositionCheck>
      ) : null}
      <InformationBoxS id="smallCardList" ref={myRef}>
        {storeData.length > 1 &&
          storeData.map((product, key) => (
            <StoreCardS key={key} product={product} id={product.name} service={service} icon={setIconShow} />
          ))}
      </InformationBoxS>
    </DicContainer>
  );
}

export default SearchListS;
