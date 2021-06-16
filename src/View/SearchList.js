import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import StoreCardL from '../Components/StoreCardL';
import { deviceSize } from '../responsive/responsive';
import SearchMenuCard from '../Components/SearchMenuCard';
import FilterBox from '../Components/FilterBox';
import { ItemTitle } from '../Components/UIComponents/Typography';

const InformationBox = styled.div`
  background: #fff;
  box-shadow: 0 3px 4px rgb(0 0 0 / 20%), 0 10px 10px rgb(0 0 0 / 10%);
  width: 435px;
  position: relative;

  height: calc(100vh - 126px);
  // top: 78px;
  overflow: auto;
  padding-top: 4px;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

const Box = styled.div`
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 10px 10px rgb(0 0 0 / 10%);
  width: 435px;
  position: relative;
  display: flex;
  align-items: center;

  height: 54px;

  // top: 78px;
  // overflow: auto;
  padding-top: 70px;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

const requirement = {
  one: { type: 'upToDown', value: '評分高至低' },
  two: { type: 'downToUp', value: '評分低至高' },
  three: { type: 'qtyUpToDown', value: '評分人數多至少' },
  four: { type: 'qtyDownToUp', value: '評分人數少至多' }
};

const species = {
  one: { type: 'store', value: '依店家顯示' },
  two: { type: 'menu', value: '依菜品顯示' }
};

function SearchList({ service }) {
  const storeData = useSelector((state) => state.storeData);
  const searchMenu = useSelector((state) => state.searchMenu);
  const [visibleType, setVisibleType] = useState(false);
  const [visibleOpt, setVisibleOpt] = useState(false);
  const [ratingType, setRatingType] = useState('upToDown');
  const [checkType, setCheckType] = useState('store');

  const [store, setStore] = useState(storeData);
  const [menu, setMenu] = useState(searchMenu);

  const dispatch = useDispatch();

  // let listRequirements = Object.values(requirement);
  // let listSpecies = Object.values(species);

  useEffect(() => {
    if (checkType === species.one.type && ratingType === requirement.one.type) {
      chronologicalUpToDown(storeData, 'rating', setStore);
    } else if (checkType === species.one.type && ratingType === requirement.two.type) {
      chronologicalDownToUp(storeData, 'rating', setStore);
    }
    if (checkType === species.two.type && ratingType === requirement.one.type) {
      chronologicalUpToDown(searchMenu, 'rating', setMenu);
    } else if (checkType === species.two.type && ratingType === requirement.two.type) {
      chronologicalDownToUp(searchMenu, 'rating', setMenu);
    }
    ////////////////////////////
    if (checkType === species.one.type && ratingType === requirement.three.type) {
      chronologicalUpToDown(storeData, 'user_ratings_total', setStore);
    } else if (checkType === species.one.type && ratingType === requirement.four.type) {
      chronologicalDownToUp(storeData, 'user_ratings_total', setStore);
    }
    if (checkType === species.two.type && ratingType === requirement.three.type) {
      chronologicalUpToDown(searchMenu, 'user_ratings_total', setMenu);
    } else if (checkType === species.two.type && ratingType === requirement.four.type) {
      chronologicalDownToUp(searchMenu, 'user_ratings_total', setMenu);
    }
  }, [checkType, ratingType, searchMenu, storeData]);

  function handleFilterSelecterClose() {
    if (visibleType || visibleOpt) {
      setVisibleType(false);
      setVisibleOpt(false);
    }
  }

  function chronologicalDownToUp(arrayData, value, state) {
    const arrayDataCopy = [...arrayData];
    arrayDataCopy.sort((a, b) => {
      return a[value] - b[value];
    });

    state(arrayDataCopy);
  }

  function chronologicalUpToDown(arrayData, value, state) {
    const arrayDataCopy = [...arrayData];

    arrayDataCopy.sort((a, b) => {
      return b[value] - a[value];
    });

    state(arrayDataCopy);
  }

  function handle() {
    dispatch({
      type: 'setMarkerHover',
      data: null
    });
  }

  return (
    <div onClick={handleFilterSelecterClose} onMouseOver={handle}>
      <Box>
        <FilterBox option={species} setType={setCheckType} visible={setVisibleType} visibleCheck={visibleType} />
        <FilterBox
          top={86}
          width={100}
          option={requirement}
          setType={setRatingType}
          visible={setVisibleOpt}
          visibleCheck={visibleOpt}
        />
      </Box>
      <InformationBox>
        {checkType === species.one.type
          ? store.map((product) => (
              <StoreCardL key={product.place_id} product={product} id={product.name} service={service} />
            ))
          : checkType === species.two.type &&
            (menu.length > 0 ? (
              menu.map((data, key) => <SearchMenuCard key={key} content={data} />)
            ) : (
              <ItemTitle padding={'50px 0 0 0'} textAlign={'center'}>
                沒有搜尋到任何菜單喔
              </ItemTitle>
            ))}
      </InformationBox>
    </div>
  );
}

export default SearchList;
