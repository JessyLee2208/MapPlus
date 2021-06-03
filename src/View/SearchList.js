import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import StoreCardL from '../Components/StoreCardL';
import { deviceSize } from '../responsive/responsive';
// import { SearchBg } from '../Components/UIComponents/common';
// import { ButtonGhostRoundIcon } from '../Components/UIComponents/Button';
import SearchMenuCard from '../Components/SearchMenuCard';
import FilterBox from '../Components/FilterBox';

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

function SearchList(props) {
  const storeData = useSelector((state) => state.storeData);
  const searchMenu = useSelector((state) => state.searchMenu);
  const [visible, setVisible] = useState(false);
  const [ratingType, setRatingType] = useState('upToDown');
  const [checkType, setCheckType] = useState('store');

  const [store, setStore] = useState(storeData);
  const [menu, setMenu] = useState(searchMenu);
  // const [ratingChronological, setRatingChronological] = useState('upToDown');
  // console.log(searchMenu);
  // console.log('searchList', ratingType, checkType, storeData, searchMenu);

  useEffect(() => {
    if (checkType === 'store' && ratingType === 'upToDown') {
      chronologicalUpToDown(storeData, 'rating', setStore);
    } else if (checkType === 'store' && ratingType === 'downToUp') {
      chronologicalDownToUp(storeData, 'rating', setStore);
    }
    if (checkType === 'menu' && ratingType === 'upToDown') {
      chronologicalUpToDown(searchMenu, 'rating', setMenu);
    } else if (checkType === 'menu' && ratingType === 'downToUp') {
      chronologicalDownToUp(searchMenu, 'rating', setMenu);
    }
    ////////////////////////////
    if (checkType === 'store' && ratingType === 'qtyUpToDown') {
      chronologicalUpToDown(storeData, 'user_ratings_total', setStore);
    } else if (checkType === 'store' && ratingType === 'qtyDownToUp') {
      chronologicalDownToUp(storeData, 'user_ratings_total', setStore);
    }
    if (checkType === 'menu' && ratingType === 'qtyUpToDown') {
      chronologicalUpToDown(searchMenu, 'user_ratings_total', setMenu);
    } else if (checkType === 'menu' && ratingType === 'qtyDownToUp') {
      chronologicalDownToUp(searchMenu, 'user_ratings_total', setMenu);
    }
  }, [checkType, ratingType]);

  function handleFilterSelecterClose() {
    // console.log(1);
    if (visible) {
      setVisible(false);
      setRatingType(false);
    }
  }

  function chronologicalDownToUp(arrayData, value, state) {
    const arrayDataCopy = [...arrayData];
    arrayDataCopy.sort((a, b) => {
      return a[value] - b[value];
    });
    // console.log(arrayData);
    state(arrayDataCopy);
  }

  function chronologicalUpToDown(arrayData, value, state) {
    const arrayDataCopy = [...arrayData];

    arrayDataCopy.sort((a, b) => {
      return b[value] - a[value];
    });
    // console.log(arrayData);
    // console.log(arrayDataCopy);
    state(arrayDataCopy);
  }

  return (
    <div onClick={handleFilterSelecterClose}>
      <Box>
        <FilterBox
          typeOne={'store'}
          tpyeTwo={'menu'}
          valueOne={'依店家顯示'}
          valueTwo={'依菜品顯示'}
          setType={setCheckType}
          // setTypeVisible={setVisible}
          // visible={visible}
        ></FilterBox>
        <FilterBox
          top={90}
          width={100}
          typeOne={'upToDown'}
          valueOne={'評分高至低'}
          tpyeTwo={'downToUp'}
          valueTwo={'評分低至高'}
          tpyeThree={'qtyUpToDown'}
          valueThree={'評分人數高至低'}
          tpyeFour={'qtyDownToUp'}
          valueFour={'評分人數低至高'}
          setType={setRatingType}
          // setTypeVisible={setVisible}
          // visible={visible}
        ></FilterBox>
      </Box>
      <InformationBox>
        {checkType === 'store'
          ? store.map((product) => (
              <StoreCardL key={product.place_id} product={product} id={product.name} service={props.service} />
            ))
          : checkType === 'menu' && menu.map((data, key) => <SearchMenuCard key={key} content={data}></SearchMenuCard>)}
      </InformationBox>
    </div>
  );
}

export default SearchList;
