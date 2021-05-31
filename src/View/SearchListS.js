import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import StoreCardS from '../Components/StoreCardS';
import { useSelector } from 'react-redux';
import { deviceSize } from '../responsive/responsive';

const UserPositionCheck = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  // right: 8px;
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

function SearchListS(props) {
  const { service } = props;
  const storeData = useSelector((state) => state.storeData);
  const myRef = useRef(null);
  const [scrollXLeft, setScrollXLeft] = useState(null);
  const [scrollXRight, setScrollXRight] = useState(null);

  const executeScrollRight = () => {
    myRef.current.scrollBy({ left: 175, top: 0, behavior: 'smooth' });
    const loction = myRef.current.scrollLeft + 175;
    const loctionRight = storeData.length * 175 - loction - window.innerWidth;

    setScrollXLeft(loction);
    setScrollXRight(loctionRight);
    console.log(loctionRight);

    // console.log(offsetright);
  };
  const executeScrollLeft = () => {
    myRef.current.scrollBy({ left: -175, top: 0, behavior: 'smooth' });
    const loction = myRef.current.scrollLeft - 175;
    const loctionRight = storeData.length * 175 - loction - window.innerWidth;

    setScrollXLeft(loction);
    setScrollXRight(loctionRight);
    console.log(loctionRight);
  };

  return (
    <div>
      {!scrollXRight || scrollXRight > -415 ? (
        <UserPositionCheck onClick={executeScrollRight} style={{ right: '8px' }}>
          <img src="/right.png" alt=""></img>
        </UserPositionCheck>
      ) : (
        <></>
      )}

      {scrollXLeft && scrollXLeft > 0 ? (
        <UserPositionCheck onClick={executeScrollLeft} style={{ left: '444px' }}>
          <img src="/left.png" alt=""></img>
        </UserPositionCheck>
      ) : (
        <></>
      )}

      <InformationBoxS id="smallCardList" ref={myRef}>
        {storeData.length > 1 &&
          storeData.map((product, key) => (
            <StoreCardS key={key} product={product} id={product.name} service={service} />
          ))}
      </InformationBoxS>
    </div>
  );
}

export default SearchListS;
