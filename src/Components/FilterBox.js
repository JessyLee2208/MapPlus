import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonGhostRoundIcon } from './UIComponents/Button';

let Filter = styled.div`
  width: ${({ width }) => (width ? width + '%' : 90 + '%')};
  height: auto;
  // padding-right: 18px;
  position: relative;
  background: #fff;
  top: ${({ top }) => (top ? top + 'px' : 44 + 'px')};
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

function FilterBox(props) {
  const { top, width, option, visibleCheck, visible, setType } = props;

  const [checkType, setCheckType] = useState(option.one.type);

  function handleFilterSelecter() {
    if (!visibleCheck) {
      visible(true);
    }
  }

  function handleChangeType(e) {
    if (e.target.id === option.one.type) {
      setCheckType(option.one.type);
      setType(option.one.type);
      visible(false);
    } else if (e.target.id === option.two.type) {
      setCheckType(option.two.type);
      setType(option.two.type);
      visible(false);
    } else if (e.target.id === option.three.type) {
      setCheckType(option.three.type);
      setType(option.three.type);
      visible(false);
    } else if (e.target.id === option.four.type) {
      setCheckType(option.four.type);
      setType(option.four.type);
      visible(false);
    }
  }

  return (
    <div>
      {visibleCheck && (
        <Filter top={top} width={width}>
          <FilterListBox onClick={handleChangeType} id={option.one.type}>
            {option.one.value}
          </FilterListBox>
          <FilterListBox onClick={handleChangeType} id={option.two.type}>
            {option.two.value}
          </FilterListBox>
          {option.three !== undefined && (
            <FilterListBox onClick={handleChangeType} id={option.three.type}>
              {option.three.value}
            </FilterListBox>
          )}
          {option.four !== undefined && (
            <FilterListBox onClick={handleChangeType} id={option.four.type}>
              {option.four.value}
            </FilterListBox>
          )}
        </Filter>
      )}

      <ButtonGhostRoundIcon src={'/down.png'} margin={'4px 0px 0 16px'} onClick={handleFilterSelecter}>
        {checkType === option.one.type
          ? option.one.value
          : checkType === option.two.type
          ? option.two.value
          : checkType === option.three.type
          ? option.three.value
          : checkType === option.four.type && option.four.value}
      </ButtonGhostRoundIcon>
    </div>
  );
}

export default FilterBox;
