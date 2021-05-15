import styled from 'styled-components';

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

function RenderStar(data, newArray) {
  if (data) {
    // newArray = [];
    let length = Math.floor(data);

    for (let i = 0; i < length; i++) {
      const star = <Img src="/active_star.png" alt=""></Img>;
      newArray.push(star);
    }
    if (data % length !== 0) {
      for (let i = 0; i < 1; i++) {
        const star = <Img src="/half_star.png" alt=""></Img>;
        newArray.push(star);
      }
      for (let i = 0; i < 4 - length; i++) {
        const star = <Img src="/default_star.png" alt=""></Img>;
        newArray.push(star);
      }
    } else {
      for (let i = 0; i < 5 - length; i++) {
        const star = <Img src="/default_star.png" alt=""></Img>;
        newArray.push(star);
      }
    }
  }
}

export default RenderStar;
