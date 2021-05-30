import React from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';
import MenuCard from '../Components/MenuCard';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle, Description, SubTitle, SubItemTitle } from '../Components/UIComponents/Typography';
import { deviceSize } from '../responsive/responsive';
import { SearchBg, SearchSeparator, Back } from '../Components/UIComponents/common';

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

const Separator = styled.div`
  width: auto;
  min-height: 1px;
  background: #efefef;
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

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
  padding-right: 2px;
`;

const InfoLink = styled.a`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #1e1e1e;
  margin: 1px;
  letter-spacing: 0.5px;　
  text-decoration:none;
`;

const InfoBox = styled.div`
  display: flex;

  align-items: center;
  padding: 8px 20px;

  &:hover {
    background: #f7f7f7;
  }
`;

const Box = styled.div`
  display: flex;

  align-items: center;
  padding: 18px 20px;
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

const TabBox = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 0 20px;
`;
const TabActive = styled.div`
  margin: 10px 20px 0px 0;
  padding-bottom: 6px;
  border-bottom: 3px solid #185ee6;
  color: #185ee6;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;

  cursor: pointer;
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

  cursor: pointer;
`;

const WithoutDishImg = styled.div`
  width: 100%;
  height: 112px;

  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

function StoreDetail(props) {
  const storeData = useSelector((state) => state.storeData);
  let starArry = [];

  let OpenStatu = <div></div>;
  let websitesURL = '';
  let deliverSite = '';
  let deliverSiteTag = <div></div>;
  let typesCheck = props.product.types.includes('food') || props.product.types.includes('cafe');

  const dispatch = useDispatch();
  const tab = useSelector((state) => state.selectedTab);

  renderStar(props.product.rating, starArry);

  if (props.product.opening_hours !== undefined) {
    const today = new Date().getDay();
    //
    if (props.product.opening_hours.weekday_text) {
      const timestamp = props.product.opening_hours.weekday_text[today].slice(5);
      OpenStatu = <Description color={'000000'}>營業中：{timestamp}</Description>;
    } else {
      OpenStatu = (
        <Description color={'000000'} padding={'0 0 0 10px'}>
          營業中
        </Description>
      );
    }
  } else if (props.product.business_status === 'CLOSED_TEMPORARILY') {
    OpenStatu = <Description color={'000000'}>歇業中</Description>;
  }

  if (props.product.website) {
    websitesURL = props.product.website.split('/');
  }

  if (props.product.deliver.foodPandaUrl !== null || props.product.deliver.uberEatUrl !== null) {
    if (props.product.deliver.uberEatUrl) {
      deliverSite = props.product.deliver.uberEatUrl.split('/');
      deliverSiteTag = (
        <InfoBox>
          <Icon src="/car.png"></Icon>
          <InfoLink href={props.product.deliver.uberEatUrl}>{deliverSite[2]}</InfoLink>
        </InfoBox>
      );
    } else if (props.product.deliver.foodPandaUrl) {
      deliverSite = props.product.deliver.foodPandaUrl.split('/');
      deliverSiteTag = (
        <InfoBox>
          <Icon src="/car.png"></Icon>
          <InfoLink href={props.product.deliver.foodPandaUrl}>{deliverSite[2]}</InfoLink>
        </InfoBox>
      );
    }
  }

  const AllReviews = [];
  if (props.product.reviews) {
    props.product.reviews.forEach((review, key) => {
      let reviewArry = [];
      let reviewer = (
        <ReviewerBox key={key}>
          <AuthorBox>
            <AuthorImg src={review.profile_photo_url}></AuthorImg>
            <div>{review.author_name}</div>
          </AuthorBox>
          {renderStar(review.rating, reviewArry)}
          <StarBoxReview>
            {reviewArry}
            <Description padding={'0 0 0 10px'}>{review.relative_time_description}</Description>
          </StarBoxReview>
          <Description color={'000000'} padding={'8px 0px'}>
            {review.text}
          </Description>
        </ReviewerBox>
      );
      AllReviews.push(reviewer);
    });
  }

  function handleClickEvent(e) {
    if (props.menu) {
      props.menu.forEach((dish) => {
        if (e.target.id === dish.name) {
          dispatch({
            type: 'setSelectedDish',
            data: dish
          });
        }
      });
    }

    if (e.target.id === 'information') {
      dispatch({
        type: 'setSelectedTab',
        data: 'information'
      });
    } else if (e.target.id === 'menu') {
      dispatch({
        type: 'setSelectedTab',
        data: 'menu'
      });
    }
  }

  function handleBack() {
    dispatch({
      type: 'setSelectedStore',
      data: null
    });
  }

  return (
    <Store onClick={handleClickEvent}>
      {storeData.length > 1 && (
        <>
          <SearchSeparator></SearchSeparator>
          <Back>
            <SubItemTitle onClick={handleBack} color={'185ee6'} style={{ position: 'relative', bottom: '-56px' }}>
              回到搜尋列表
            </SubItemTitle>
          </Back>
          <SearchBg></SearchBg>
        </>
      )}

      {props.product.photos && props.product.photos.length !== 0 ? (
        <StoreImg alt="" src={props.product.photos[0].getUrl()}></StoreImg>
      ) : props.product.photo ? (
        <StoreImg alt="" src={props.product.photo[0]}></StoreImg>
      ) : (
        <WithoutDishImg></WithoutDishImg>
      )}

      <PageTitle>{props.product.name}</PageTitle>
      <RatingDiv>
        <Description>{props.product.rating}</Description>
        <StarBoxStore>{starArry}</StarBoxStore>
        <Description>{props.product.user_ratings_total} 則評論</Description>
      </RatingDiv>
      <Separator></Separator>
      {props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl ? (
        <TabBox>
          {tab === 'information' ? <TabActive id="information">資訊</TabActive> : <Tab id="information">資訊</Tab>}
          {tab === 'menu' ? <TabActive id="menu">菜單</TabActive> : <Tab id="menu">菜單</Tab>}
        </TabBox>
      ) : (
        <div></div>
      )}
      <Separator></Separator>
      {tab === 'information' ? (
        <div>
          {typesCheck ? (
            <Box>
              <CheckIcon src="/true.png"></CheckIcon>
              <Description>內用</Description>
              <Description>．</Description>
              <CheckIcon src="/true.png"></CheckIcon>
              <Description>外帶</Description>
              <Description>．</Description>
              {props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl ? (
                <CheckIcon src="/true.png"></CheckIcon>
              ) : (
                <CheckIcon src="/false.png"></CheckIcon>
              )}
              <Description>外送</Description>
            </Box>
          ) : (
            <div></div>
          )}

          <InforList>
            <InfoBox>
              <Icon src="/location.png"></Icon>
              <Description color={'000000'}>{props.product.formatted_address}</Description>
            </InfoBox>
            <InfoBox>
              <Icon src="/time.png"></Icon>
              {OpenStatu}
            </InfoBox>
            {deliverSiteTag}
            {props.product.website ? (
              <InfoBox>
                <Icon src="/earth.png"></Icon>
                <InfoLink href={props.product.website}>{websitesURL[2]}</InfoLink>
              </InfoBox>
            ) : (
              <div></div>
            )}
            {props.product.formatted_phone_number ? (
              <InfoBox>
                <Icon src="/phone.png"></Icon>
                <Description color={'000000'}>{props.product.formatted_phone_number}</Description>
              </InfoBox>
            ) : (
              <div></div>
            )}

            <InfoBox>
              <Icon src="/plusCode.png"></Icon>
              <Description color={'000000'}>{props.product.plus_code.compound_code}</Description>
            </InfoBox>
          </InforList>
          <Separator></Separator>
          <SubTitle>評論摘要</SubTitle>
          {AllReviews}
        </div>
      ) : props.menu && props.menu !== null && tab === 'menu' ? (
        props.menu.map((item) => <MenuCard data={item} key={item.dishCollectionID} id={item.dishCollectionID} />)
      ) : (
        <div></div>
      )}
    </Store>
  );
}

export default StoreDetail;
