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

  let listOptions = Object.values(option);

  function handleChangeType(e) {
    listOptions.forEach((opt) => {
      if (e.target.id === opt.type) {
        setCheckType(opt.type);
        setType(opt.type);
        visible(false);
      }
    });
  }

  return (
    <div>
      <Filter top={top} width={width}>
        {listOptions.map(
          (opt) =>
            visibleCheck && (
              <FilterListBox onClick={handleChangeType} id={opt.type}>
                {opt.value}
              </FilterListBox>
            )
        )}
      </Filter>

      <ButtonGhostRoundIcon src={'/down.png'} margin={'4px 0px 0 16px'} onClick={handleFilterSelecter}>
        {listOptions.map((opt) => checkType === opt.type && opt.value)}
      </ButtonGhostRoundIcon>
    </div>
  );
}

export default FilterBox;
