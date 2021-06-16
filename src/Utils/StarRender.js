import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: ${({ width }) => (width ? width + 'px' : '16px')};
  height: ${({ height }) => (height ? height + 'px' : '16px')};
`;

function StarRender(data, props) {
  const { width, height } = props;

  let newArray = [];
  if (data !== 0) {
    let length = Math.floor(data);

    for (let i = 0; i < length; i++) {
      let radomNumber = Math.random().toString(36).substr(10, 10) + Date.now().toString(36).substr(4, 4);
      const star = <Img src="/active_star.png" alt="" id={i + 1} key={radomNumber} width={width} height={height}></Img>;
      newArray.push(star);
    }
    if (data % length !== 0) {
      for (let i = 0; i < 1; i++) {
        let radomNumber = Math.random().toString(36).substr(10, 10) + Date.now().toString(36).substr(4, 4);
        const star = <Img src="/half_star.png" alt="" key={radomNumber} width={width} height={height}></Img>;
        newArray.push(star);
      }
      for (let i = 0; i < 4 - length; i++) {
        let radomNumber = Math.random().toString(36).substr(10, 10) + Date.now().toString(36).substr(4, 4);
        const star = <Img src="/default_star.png" alt="" key={radomNumber} width={width} height={height}></Img>;
        newArray.push(star);
      }
    } else {
      for (let i = 0; i < 5 - length; i++) {
        let radomNumber = Math.random().toString(36).substr(10, 10) + Date.now().toString(36).substr(4, 4);
        const star = (
          <Img src="/default_star.png" alt="" id={i + length + 1} key={radomNumber} width={width} height={height}></Img>
        );
        newArray.push(star);
      }
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const star = <Img src="/default_star.png" alt="" id={i + 1} key={i} width={width} height={height}></Img>;
      newArray.push(star);
    }
  }

  return newArray;
}

export default StarRender;
