import React, { useEffect } from 'react';
import lottie from 'lottie-web';
import reactLogo from '../../static/loading.json';
import styled from 'styled-components';

const Test = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-right: 12px;
`;

function Loading() {
  useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector('#loading'),
      animationData: reactLogo
    });
  }, []);

  return (
    <div>
      <Test id="loading"></Test>
    </div>
  );
}

export { Loading };
