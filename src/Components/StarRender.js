import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: ${({ width }) => (width ? width + 'px' : '16px')};
  height: ${({ height }) => (height ? height + 'px' : '16px')};
`;

function StarRender(data, { width, height }) {
  let newArray = [];

  function createElement(labelType, id, keyNum) {
    let radomNumber = Math.random().toString(36).substr(10, 10) + Date.now().toString(36).substr(4, 4);
    let srcLink = '/' + labelType + '_star.png';

    const star = <Img src={srcLink} alt="" id={id} key={keyNum || radomNumber} width={width} height={height}></Img>;
    newArray.push(star);
  }

  if (data !== 0) {
    let length = Math.floor(data);

    for (let i = 0; i < length; i++) {
      let id = i + 1;
      createElement('active', id);
    }
    if (data % length !== 0) {
      for (let i = 0; i < 1; i++) {
        createElement('half');
      }
      for (let i = 0; i < 4 - length; i++) {
        createElement('default');
      }
    } else {
      for (let i = 0; i < 5 - length; i++) {
        let id = i + length + 1;
        createElement('default', id);
      }
    }
  } else {
    for (let i = 0; i < 5; i++) {
      let id = i + 1;
      createElement('default', id);
    }
  }

  return newArray;
}

export default StarRender;
