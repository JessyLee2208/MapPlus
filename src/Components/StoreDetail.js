import React from 'react';
import styled from 'styled-components';
import renderStar from '../Utils/renderStar';
import MenuCard from './MenuCard';
import { useDispatch, useSelector } from 'react-redux';

const Store = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
`;

const StoreImg = styled.img`
  width: 100%;
  height: 260px;

  text-align: right;
  flex-shrink: 1;
  object-fit: cover;
`;

const StoreTitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding: 12px 0 12px 18px;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  padding: 0 0 0 18px;
  align-items: center;
  border-bottom: 1px solid #efefef;
  margin-bottom: 10px;
  padding-bottom: 10px;
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
  // width: 24px;
  height: 24px;
  padding-right: 18px;
`;

const CheckIcon = styled.img`
  width: 24px;
  height: 24px;
  padding-right: 2px;
`;

const Info = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #5d6267;
  margin: 1px;
`;

const InfoDetail = styled.p`
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
  padding: 8px 0 8px 18px;
  align-items: center;
`;

const InforList = styled.div`
  border-bottom: 1px solid #efefef;
  border-top: 1px solid #efefef;
  margin-top: 10px;
  padding-top: 10px;
`;

const H3Title = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding: 12px 0 0px 18px;
`;

const ReviewerBox = styled.div`
  padding: 8px 16px 8px 18px;
  align-items: center;
  flex-irection: 'column';
  border-bottom: 1px solid #efefef;
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0 14px 0;
`;

const AuthorImg = styled.img`
  // width: 32px;
  height: 32px;
  padding-right: 12px;
`;

const TabBox = styled.div`
  display: flex;
  padding-left 20px;
  border-bottom: 1px solid #efefef;
  margin-bottom: 10px;
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
`;

function StoreDetail(props) {
  let starArry = [];

  let OpenStatu = <div></div>;
  let websitesURL = '';
  let deliverSite = '';
  let deliverSiteTag = <div></div>;
  let typesCheck = props.product.types.includes('food') || props.product.types.includes('cafe');
  // let showType = <div></div>;
  // const [selectedTab, setSelectedTab] = React.useState('information');
  const dispatch = useDispatch();
  const tab = useSelector((state) => state.selectedTab);

  renderStar(props.product.rating, starArry);

  if (props.product.opening_hours !== undefined) {
    const today = new Date().getDay();
    //
    if (props.product.opening_hours.weekday_text) {
      const timestamp = props.product.opening_hours.weekday_text[today].slice(5);
      OpenStatu = <InfoDetail>營業中：{timestamp}</InfoDetail>;
    } else {
      OpenStatu = <InfoDetail>營業中</InfoDetail>;
    }
  } else if (props.product.business_status === 'CLOSED_TEMPORARILY') {
    OpenStatu = <InfoDetail> 歇業中</InfoDetail>;
  }

  if (props.product.website) {
    websitesURL = props.product.website.split('/');
  }
  // DeliverURLCheck(props.product.deliver.foodPandaUrl, props.product.deliver.uberEatUrl, deliverSite, deliverSiteTag);
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
            <Info> {review.relative_time_description}</Info>
          </StarBoxReview>
          <InfoDetail>{review.text}</InfoDetail>
        </ReviewerBox>
      );
      AllReviews.push(reviewer);
    });
  }

  function handleClickEvent(e) {
    // if(e.target.id ===)
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
      // setSelectedTab('information');
      dispatch({
        type: 'setSelectedTab',
        data: 'information'
      });
    } else if (e.target.id === 'menu') {
      // setSelectedTab('menu');
      dispatch({
        type: 'setSelectedTab',
        data: 'menu'
      });
    }
  }

  return (
    <Store onClick={handleClickEvent}>
      {props.product.photos.length !== 0 && props.product.photos ? (
        <StoreImg alt="" src={props.product.photos[0].getUrl()}></StoreImg>
      ) : (
        <div></div>
      )}

      <StoreTitle>{props.product.name}</StoreTitle>
      <RatingDiv>
        <Info>{props.product.rating}</Info>
        <StarBoxStore>{starArry}</StarBoxStore>
        <Info>{props.product.user_ratings_total} 則評論</Info>
      </RatingDiv>
      {props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl ? (
        <TabBox>
          {tab === 'information' ? <TabActive id="information">資訊</TabActive> : <Tab id="information">資訊</Tab>}
          {tab === 'menu' ? <TabActive id="menu">菜單</TabActive> : <Tab id="menu">菜單</Tab>}
        </TabBox>
      ) : (
        <div></div>
      )}

      {tab === 'information' ? (
        <div>
          {typesCheck ? (
            props.product.deliver.uberEatUrl || props.product.deliver.foodPandaUrl ? (
              <InfoBox>
                <CheckIcon src="/true.png"></CheckIcon> <Info>內用</Info>
                <Info>．</Info>
                <CheckIcon src="/true.png"></CheckIcon> <Info>外帶</Info>
                <Info>．</Info>
                <CheckIcon src="/true.png"></CheckIcon> <Info>外送</Info>
              </InfoBox>
            ) : (
              <InfoBox>
                <CheckIcon src="/true.png"></CheckIcon> <Info>內用</Info>
                <Info>．</Info>
                <CheckIcon src="/true.png"></CheckIcon> <Info>外帶</Info>
                <Info>．</Info>
                <CheckIcon src="/false.png"></CheckIcon> <Info>外送</Info>
              </InfoBox>
            )
          ) : (
            <div></div>
          )}

          <InforList>
            <InfoBox>
              <Icon src="/location.png"></Icon>
              <InfoDetail>{props.product.formatted_address} </InfoDetail>
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
                <InfoDetail>{props.product.formatted_phone_number}</InfoDetail>
              </InfoBox>
            ) : (
              <div></div>
            )}

            <InfoBox>
              <Icon src="/plusCode.png"></Icon>
              <InfoDetail>{props.product.plus_code.compound_code}</InfoDetail>
            </InfoBox>
          </InforList>

          <H3Title>評論摘要</H3Title>
          {AllReviews}
        </div>
      ) : props.menu !== undefined && props.menu !== null && tab === 'menu' ? (
        props.menu.map((item) => <MenuCard data={item} key={item.dishCollectionID} id={item.dishCollectionID} />)
      ) : (
        <div></div>
      )}
    </Store>
  );
}

export default StoreDetail;
