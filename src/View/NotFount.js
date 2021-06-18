import React from 'react';
import styled from 'styled-components';
import { SubTitle, Description } from '../Components/UIComponents/Typography';
import { deviceSize } from '../properties/properties';

const InformationBox = styled.div`
  background: #fff;

  position: relative;

  height: calc(100vh - 126px);
  top: 78px;
  overflow: auto;
  padding-top: 20px;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

function NotFound(props) {
  const { searchText } = props;

  return (
    <InformationBox>
      <SubTitle>Google 地圖找不到「{searchText}」</SubTitle>
      <Description padding={'10px 0 0 20px'}>請確認你的搜尋字詞沒有任何錯別字。</Description>
      <Description padding={'2px 0 0 20px'}>嘗試新增食物名稱或是食物種類</Description>
    </InformationBox>
  );
}

export default NotFound;
