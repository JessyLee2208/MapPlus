import React, { useEffect } from 'react';
import lottie from 'lottie-web';
import reactLogo from '../../static/loading.json';
import styled from 'styled-components';

const Test = styled.div`
  width: auto;
  height: 150px;

  margin-top: ${({ marginTop }) => (marginTop ? marginTop : '25vh')};
`;

function Loading(props) {
  const { marginTop } = props;
  useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector('#loading'),
      animationData: reactLogo
    });
  }, []);

  return (
    <div>
      <Test id="loading" marginTop={marginTop}></Test>
    </div>
  );
}

export { Loading };
