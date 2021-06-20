import React from 'react';
import styled from 'styled-components';
import { Description } from '../Components/UIComponents/Typography';

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
  padding-right: 2px;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ padding }) => (padding ? padding : '18px 20px')};
`;

function DeliverStateCheck({ product, padding }) {
  let typesCheck = product.types.includes('food') || product.types.includes('cafe');
  const deliverShow = product.deliver.uberEatUrl || product.deliver.foodPandaUrl;

  return (
    typesCheck && (
      <Box padding={padding}>
        <CheckIcon src="/true.png" />
        <Description>內用</Description>
        <Description>．</Description>
        <CheckIcon src="/true.png" />
        <Description>外帶</Description>
        <Description>．</Description>
        <CheckIcon src={deliverShow ? '/true.png' : '/false.png'}></CheckIcon>
        <Description>外送</Description>
      </Box>
    )
  );
}

export default DeliverStateCheck;
