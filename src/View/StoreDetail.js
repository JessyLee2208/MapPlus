import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import StarRender from '../Components/StarRender';
import MenuCard from '../Components/MenuCard';
import TabBar from '../Components/TabBar';
import SearchBack from '../Components/SearchBack';
import DeliverStateCheck from '../Components/DeliverStateCheck';
import { PageTitle, Description, SubTitle, ItemTitle, InfoLink } from '../Components/UIComponents/Typography';
import { Separator } from '../Components/UIComponents/common';
import { Loading } from '../Components/UIComponents/LottieAnimat';

import { tagType, deviceSize } from '../properties/properties';

const Store = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

const StoreImg = styled.img`
  width: 100%;
  height: 260px;
  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;

  align-items: center;
  margin-bottom: 10px;
  padding: 0 20px;
`;

const StarBoxStore = styled.div`
  display: flex;
  margin: 0 6px;
  align-items: center;
`;

const StarBoxReview = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  padding-right: 18px;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 20px;

  &:hover {
    background: #f7f7f7;
  }
`;

const InforList = styled.div`
  border-top: 1px solid #efefef;
  padding: 10px 0;
`;

const ReviewerBox = styled.div`
  padding: 8px 20px;
  align-items: center;
  flex-irection: 'column';
  border-bottom: 1px solid #efefef;
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
`;

const AuthorImg = styled.img`
  width: 32px;
  height: 32px;
  padding-right: 12px;
`;

const WithoutDishImg = styled.div`
  width: 100%;
  height: 112px;

  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const SearchCity = styled.span`
  // padding-top: 10px;
  color: #185ee6;
`;

function StoreDetail({ product, menu, input }) {
  const dispatch = useDispatch();
  const tab = useSelector((state) => state.selectedTab);
  const storeData = useSelector((state) => state.storeData);

  const locationCheck = product.types[0].includes('administrative_area_level');

  const deliverCheck = product.deliver.foodPandaUrl !== null || product.deliver.uberEatUrl !== null;
  const deliverShow = product.deliver.uberEatUrl || product.deliver.foodPandaUrl;

  let timestamp = '';
  let websitesURL = '';
  let deliverSite = '';

  if (product.opening_hours !== undefined) {
    const today = new Date().getDay();
    if (product.opening_hours.weekday_text) {
      timestamp = product.opening_hours.weekday_text[today].slice(5);
    }
  }
  if (product.website) {
    websitesURL = product.website.split('/');
  }

  if (deliverCheck) {
    if (product.deliver.uberEatUrl) {
      deliverSite = product.deliver.uberEatUrl.split('/');
    } else if (product.deliver.foodPandaUrl) {
      deliverSite = product.deliver.foodPandaUrl.split('/');
    }
  }

  if (input.current.value === '') {
    input.setSearchText(product.name);
    input.current.value = product.name;
  }

  function handleClickEvent(e) {
    dispatch({
      type: 'setUserReviewSet',
      data: null
    });
    dispatch({
      type: 'setCollectData',
      data: []
    });
    if (menu) {
      menu.forEach((dish) => {
        if (e.target.id === dish.name) {
          dispatch({
            type: 'setSelectedDish',
            data: dish
          });
        }
      });
    }
  }

  function handleBack() {
    dispatch({
      type: 'setSelectedStore',
      data: null
    });
    dispatch({
      type: 'setMenuData',
      data: []
    });
  }

  function handle() {
    dispatch({
      type: 'setMarkerHover',
      data: null
    });
  }

  return (
    <Store onClick={handleClickEvent} onMouseOver={handle}>
      {storeData.length > 1 && <SearchBack onClick={handleBack}>??????????????????</SearchBack>}

      {product.photos && product.photos.length !== 0 ? (
        <StoreImg alt="" src={product.photos[0].getUrl()} />
      ) : product.photo ? (
        <StoreImg alt="" src={product.photo[0]} />
      ) : (
        <WithoutDishImg />
      )}

      <PageTitle>{product.name}</PageTitle>
      {!locationCheck ? (
        <>
          <RatingDiv>
            <Description>{product.rating}</Description>
            <StarBoxStore>{StarRender(product.rating, { width: 16, height: 16 })}</StarBoxStore>
            <Description>{product.user_ratings_total} ?????????</Description>
          </RatingDiv>
          <Separator />
          {deliverShow && <TabBar />}

          {tab === tagType.information ? (
            <div>
              <DeliverStateCheck product={product}></DeliverStateCheck>

              <InforList>
                <InfoBox>
                  <Icon src="/location.png" />
                  <Description color={'000000'}>{product.formatted_address}</Description>
                </InfoBox>
                <InfoBox>
                  <Icon src="/time.png" />

                  {product.opening_hours !== undefined ? (
                    <Description color={'000000'}>
                      {product.opening_hours.weekday_text ? '???????????????' + timestamp : '?????????'}
                    </Description>
                  ) : (
                    product.business_status === 'CLOSED_TEMPORARILY' && (
                      <Description color={'000000'}>?????????</Description>
                    )
                  )}
                </InfoBox>

                {deliverCheck && (
                  <InfoBox>
                    <Icon src="/car.png" />
                    <InfoLink
                      href={product.deliver.uberEatUrl ? product.deliver.uberEatUrl : product.deliver.foodPandaUrl}
                    >
                      {deliverSite[2]}
                    </InfoLink>
                  </InfoBox>
                )}
                {product.website && (
                  <InfoBox>
                    <Icon src="/earth.png" />
                    <InfoLink href={product.website}>{websitesURL[2]}</InfoLink>
                  </InfoBox>
                )}
                {product.formatted_phone_number && (
                  <InfoBox>
                    <Icon src="/phone.png" />
                    <Description color={'000000'}>{product.formatted_phone_number}</Description>
                  </InfoBox>
                )}

                <InfoBox>
                  <Icon src="/plusCode.png"></Icon>
                  <Description color={'000000'}>{product.plus_code ? product.plus_code.compound_code : ''}</Description>
                </InfoBox>
              </InforList>
              <Separator />

              <SubTitle>????????????</SubTitle>
              {product.reviews.map((review, key) => (
                <ReviewerBox key={key}>
                  <AuthorBox>
                    <AuthorImg src={review.profile_photo_url} />
                    <div>{review.author_name}</div>
                  </AuthorBox>
                  <StarBoxReview>
                    {StarRender(review.rating, { width: 16, height: 16 })}
                    <Description padding={'0 0 0 10px'}>{review.relative_time_description}</Description>
                  </StarBoxReview>
                  <Description color={'000000'} padding={'8px 0px'}>
                    {review.text}
                  </Description>
                </ReviewerBox>
              ))}
            </div>
          ) : (
            tab === tagType.menu &&
            (menu?.length > 0 ? (
              menu.map((item) => <MenuCard data={item} key={item.dishCollectionID} id={item.dishCollectionID} />)
            ) : (
              <Loading marginTop={'7vh'} />
            ))
          )}
        </>
      ) : (
        <>
          <Description padding={'0px 0 0 20px'}>{product.formatted_address}</Description>

          <ItemTitle textAlign={'center'} padding={'60px 0 8px 0 '}>
            ????????????{input}????????????{' '}
          </ItemTitle>
          <ItemTitle textAlign={'center'}>
            ?????????<SearchCity>??? {input} + ?????? ???</SearchCity>??????
          </ItemTitle>
        </>
      )}
    </Store>
  );
}

export default StoreDetail;
