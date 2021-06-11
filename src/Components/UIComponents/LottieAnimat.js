import React, { useEffect } from 'react';
import lottie from 'lottie-web';
import reactLogo from '../../static/loading.json';
import loader from '../../static/infinite-loader.json';
import styled from 'styled-components';

const Test = styled.div`
  width: auto;
  height: 150px;

  margin-top: ${({ marginTop }) => (marginTop ? marginTop : '25vh')};
`;

const Infinite = styled.div`
  width: auto;
  height: 10vh;

  margin-top: ${({ marginTop }) => (marginTop ? marginTop : '0vh')};
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

function InfiniteLoading(props) {
  const { marginTop } = props;
  useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector('#infiniteloader'),
      animationData: loader
    });
  }, []);

  return (
    <div>
      <Infinite id="infiniteloader" marginTop={marginTop}></Infinite>
    </div>
  );
}

export { Loading, InfiniteLoading };
