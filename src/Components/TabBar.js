import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Separator } from '../Components/UIComponents/common';
import { tagType } from '../properties/properties';

const TabBox = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 0 20px;
  height: 36px;
`;

const Tab = styled.div`
  margin: 10px 20px 0px 0;
  padding-bottom: 6px;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  display: block;
  height: 18px;
  cursor: pointer;
`;

const TabActive = styled(Tab)`
  border-bottom: 3px solid #185ee6;
  color: #185ee6;
  font-size: 15px;
`;

function TabBar() {
  const tab = useSelector((state) => state.selectedTab);
  const dispatch = useDispatch();

  const tabOnClickHandler = (e) => {
    if (e.target.id === tagType.information) {
      dispatch({
        type: 'setSelectedTab',
        data: tagType.information
      });
    } else if (e.target.id === tagType.menu) {
      dispatch({
        type: 'setSelectedTab',
        data: tagType.menu
      });
    }
  };

  return (
    <div>
      <TabBox onClick={tabOnClickHandler}>
        {tab === tagType.information ? (
          <TabActive id={tagType.information}>資訊</TabActive>
        ) : (
          <Tab id={tagType.information}>資訊</Tab>
        )}
        {tab === tagType.menu ? <TabActive id={tagType.menu}>菜單</TabActive> : <Tab id={tagType.menu}>菜單</Tab>}
      </TabBox>
      <Separator />
    </div>
  );
}
export default TabBar;
