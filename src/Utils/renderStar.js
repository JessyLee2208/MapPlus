import styled from 'styled-components';

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

function renderStar(data, newArray) {
  // let keyrRandom = randomKey();
  if (data !== 0) {
    // newArray = [];
    let length = Math.floor(data);

    for (let i = 0; i < length; i++) {
      let radomNumber = Math.random().toString(36).substr(6, 6) + Date.now().toString(36).substr(4, 4);
      const star = <Img src="/active_star.png" alt="" id={i + 1} key={radomNumber}></Img>;
      newArray.push(star);
    }
    if (data % length !== 0) {
      for (let i = 0; i < 1; i++) {
        let radomNumber = Math.random().toString(36).substr(6, 6) + Date.now().toString(36).substr(4, 4);
        const star = <Img src="/half_star.png" alt="" key={radomNumber}></Img>;
        newArray.push(star);
      }
      for (let i = 0; i < 4 - length; i++) {
        let radomNumber = Math.random().toString(36).substr(6, 6) + Date.now().toString(36).substr(4, 4);
        const star = <Img src="/default_star.png" alt="" key={radomNumber}></Img>;
        newArray.push(star);
      }
    } else {
      for (let i = 0; i < 5 - length; i++) {
        let radomNumber = Math.random().toString(36).substr(6, 6) + Date.now().toString(36).substr(4, 4);
        const star = <Img src="/default_star.png" alt="" id={i + length + 1} key={radomNumber}></Img>;
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
