import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonGhostRoundIcon } from './UIComponents/Button';

let Filter = styled.div`
  width: ${({ width }) => (width ? width + '%' : 90 + '%')};
  height: auto;
  // padding-right: 18px;
  position: relative;
  background: #fff;
  top: ${({ top }) => (top ? top + 'px' : 49 + 'px')};
  left: 16px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
  border-radius: 8px;
  z-index: 1;
`;

const FilterListBox = styled.div`
  display: flex;
  margin: 0;
  padding: 8px 16px 10px 12px;
  align-items: center;

  &:hover {
    background: #eef0f1;
  }
`;

// const Div = styled.div`
// display: flex;
// `

function FilterBox(props) {
  const { top, width } = props;
  const [showType, setShowType] = useState(false);
  const [checkType, setCheckType] = useState(props.typeOne);

  function handleFilterSelecter() {
    if (!showType) {
      // props.setTypeVisible(true);
      setShowType(true);
    } else {
      // props.setTypeVisible(false);
      setShowType(false);
    }
  }

  function handleChangeType(e) {
    if (e.target.id === props.typeOne) {
      setCheckType(props.typeOne);
      props.setType(props.typeOne);
      // props.setTypeVisible(false);
      setShowType(false);
    } else if (e.target.id === props.tpyeTwo) {
      setCheckType(props.tpyeTwo);
      props.setType(props.tpyeTwo);
      // props.setTypeVisible(false);
      setShowType(false);
    } else if (e.target.id === props.tpyeThree) {
      setCheckType(props.tpyeThree);
      props.setType(props.tpyeThree);
      // props.setTypeVisible(false);
      setShowType(false);
    } else if (e.target.id === props.tpyeFour) {
      setCheckType(props.tpyeFour);
      props.setType(props.tpyeFour);
      // props.setTypeVisible(false);
      setShowType(false);
    }
  }

  return (
    <div>
      {showType && (
        <Filter top={top} width={width}>
          <FilterListBox onClick={handleChangeType} id={props.typeOne}>
            {props.valueOne}
          </FilterListBox>
          <FilterListBox onClick={handleChangeType} id={props.tpyeTwo}>
            {props.valueTwo}
          </FilterListBox>
          {props.tpyeThree && (
            <FilterListBox onClick={handleChangeType} id={props.tpyeThree}>
              {props.valueThree}
            </FilterListBox>
          )}
          {props.tpyeFour && (
            <FilterListBox onClick={handleChangeType} id={props.tpyeFour}>
              {props.valueFour}
            </FilterListBox>
          )}
        </Filter>
      )}

      <ButtonGhostRoundIcon src={'/down.png'} margin={'4px 0px 0 16px'} onClick={handleFilterSelecter}>
        {checkType === props.typeOne
          ? props.valueOne
          : checkType === props.tpyeTwo
          ? props.valueTwo
          : checkType === props.tpyeThree
          ? props.valueThree
          : checkType === props.tpyeFour && props.valueFour}
      </ButtonGhostRoundIcon>
    </div>
  );
}

export default FilterBox;
