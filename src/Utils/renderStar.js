import styled from 'styled-components';

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

function randomKey() {
  let str = '';
  let arr = [];
  for (let i = 0; i < 5; i++) {
    str = Math.round(Math.random() * 100);
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === str) {
        arr.splice(j, 1);
        i--;
      }
    }
    arr.push(str);
  }
  return arr;
}

function renderStar(data, newArray) {
  let keyrRandom = randomKey();
  if (data !== 0) {
    // newArray = [];
    let length = Math.floor(data);

    for (let i = 0; i < length; i++) {
      const star = <Img src="/active_star.png" alt="" id={i + 1} key={keyrRandom[i]}></Img>;
      newArray.push(star);
    }
    if (data % length !== 0) {
      for (let i = 0; i < 1; i++) {
        const star = <Img src="/half_star.png" alt="" key={keyrRandom[length]}></Img>;
        newArray.push(star);
      }
      for (let i = 0; i < 4 - length; i++) {
        const star = <Img src="/default_star.png" alt="" key={keyrRandom[length + 1]}></Img>;
        newArray.push(star);
      }
    } else {
      for (let i = 0; i < 5 - length; i++) {
        const star = <Img src="/default_star.png" alt="" id={i + length + 1} key={keyrRandom[i + length]}></Img>;
        newArray.push(star);
      }
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const star = <Img src="/default_star.png" alt="" id={i + 1} key={i}></Img>;
      newArray.push(star);
    }
  }
}

export default renderStar;
