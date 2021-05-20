import React from 'react';
import styled from 'styled-components';
import { addDishToCollectList } from '../Utils/firebase';
import { useDispatch, useSelector } from 'react-redux';

const CollectBox = styled.div`
  width: auto;
  height: auto;
  padding-right: 18px;
  position: absolute;
  background: #fff;
  top: 316px;
  right: 20px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
  border-radius: 8px;
`;

const InfoBold = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #black;
  margin: 0px 0 0 10px;
`;

const CollectListBox = styled.div`
  display: flex;
  margin: 0;
  padding: 0 10px 0 8px;
  align-items: center;
  margin-bottom: 10px;
`;

const Icon = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 4px;
`;

const CollectTitle = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #black;
  margin: 0px 0 0 10px;
`;

const InfoRugular = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #black;
  margin: 0px 0 0 10px;
`;

function Collection() {
  const dispatch = useDispatch();
  const selectedDish = useSelector((state) => state.selectedDish);
  const userStatus = useSelector((state) => state.userStatus);

  function handleCollectListClick(e) {
    const selectedCollect = e.target.innerHTML;
    console.log(e.target.innerHTML);
    addDishToCollectList(userStatus.email, selectedDish, selectedCollect).then(() => {
      dispatch({
        type: 'setCollect',
        data: false
      });
    });
  }
  return (
    <CollectBox onClick={handleCollectListClick} id="collect">
      <InfoBold style={{ color: 'black', padding: '10px 0 10px 0px' }} id="collect">
        儲存至清單中
      </InfoBold>
      <CollectListBox id="collect" value="想去的地點">
        <Icon src="/falg.png"></Icon>
        <CollectTitle id="collect" value="想去的地點">
          想去的地點
        </CollectTitle>
      </CollectListBox>
      <CollectListBox id="collect">
        <Icon src="/heart.png"></Icon>
        <CollectTitle id="collect" value="喜愛的地點">
          喜愛的地點
        </CollectTitle>
      </CollectListBox>
      <CollectListBox id="collect">
        <Icon src="/active_star.png"></Icon>
        <CollectTitle id="collect" value="已加星號的地點">
          已加星號的地點
        </CollectTitle>
      </CollectListBox>
    </CollectBox>
  );
}

export default Collection;
