import React from 'react';
import styled from 'styled-components';
// import stat from '../';

const product = {
  business_status: 'OPERATIONAL',
  formatted_address: '235台灣新北市中和區中和路38號',
  geometry: { location: { lat: 25.020397, lng: 121.533053 } },

  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
  photo: 'https://lh3.googleusercontent.com/p/AF1QipNRV2UIGgC0MpU4B3owIKFjLF9fK7dP-vTkxw8V=s1600-w768',
  name: '麥當勞-中和店',
  place_id: 'ChIJV3oxq9epQjQR7bVgz_E6z54',
  plus_code: { compound_code: '2F2X+JX 中和區 新北市', global_code: '7QQ32F2X+JX' },
  price_level: 1,
  rating: 3.7,
  user_ratings_total: 1460,
  formatted_phone_number: '0222460725',
  weekday_text: [
    '星期一: 11:00 – 15:00, 17:00 – 00:00',
    '星期二: 11:00 – 15:00, 17:00 – 00:00',
    '星期三: 11:00 – 15:00, 17:00 – 00:00',
    '星期四: 11:00 – 15:00, 17:00 – 00:00',
    '星期五: 11:00 – 15:00, 17:00 – 00:00',
    '星期六: 11:00 – 15:00, 17:00 – 00:00',
    '星期日: 11:00 – 15:00, 17:00 – 00:00'
  ],
  deliver: { uber: '', foodpanda: 'https://www.foodpanda.com.tw/restaurant/new/k7px/jia-xiang-wei-yue-nan-mei-shi' },
  //   plus_code
  website: 'https://www.mcdonalds.com/tw/zh-tw.html',
  peridos: [
    {
      close: { day: 0, hours: 22, minutes: 0, nextDate: 1621173600000, time: '2200' },
      open: {
        day: 0,
        hours: 13,
        minutes: 0,
        nextDate: 1621141200000,
        time: '1300'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    },
    {
      close: { day: 2, hours: 0, minutes: 0, nextDate: 1621267200000, time: '0000' },
      open: {
        day: 1,
        hours: 8,
        minutes: 0,
        nextDate: 1621209600000,
        time: '0800'
      }
    }
  ],
  types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
  reviews: [
    {
      author_name: '大低價',
      author_url: 'https://www.google.com/maps/contrib/117482449701541623825/reviews',
      language: 'zh-Hant',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a-/AOh14GjTyLtLmBavsUvAgFbSuOO2jb9NmlmUDegOmi3uJw=s128-c0x00000000-cc-rp-mo-ba3',
      rating: 5,
      relative_time_description: '2 週前',
      text:
        '嘉義縣朴子市超低價雷神百貨家電王Line：godmop推薦 台北住了二十幾年 難得遇見的好餐廳 選項多又不貴 師大和公館商圈 cp值最高 裝潢最時尚 位置舒適度 營業面積 清潔度 新穎性 飲料 酒品種類 和選擇性 售價等 從餐具的選擇 和椅子的 設計都很用心 海鮮還有生蠔 生蝦 炒青蛙 整尾手術後應吃的鱸魚湯320元  也有素食料理 金錢蝦餅超厚實 若要點飲料或甜點 就直接點套餐比較划算 水果茶熱的才是一大壺  去冰的一給我中杯 冰淇淋一球才30 紅酒的清酒 威士忌都有',
      time: 1619332079
    },
    {
      author_name: 'Max Toff',
      author_url: 'https://www.google.com/maps/contrib/115354329543354609045/reviews',
      language: 'zh-Hant',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a/AATXAJxfd8ialfcKlSk1crQUj80sb5PtWXbGpc_I9QX2=s128-c0x00000000-cc-rp-mo-ba2',
      rating: 5,
      relative_time_description: '1 個月前',
      text:
        '路過～先被外觀所吸引，走近一看確是泰菜餐館，本來就愛吃泰國菜的我倆，就馬上嚐鮮，以為會是吃裝潢或是不道地的餐廳（因爲外表太不像是泰國菜餐館了），所以點了都是泰菜基本菜色試試，瑪莎曼咖哩燉牛肉濃郁到不行，香氣十足，甜點跟飲品都不馬乎，都像精品咖啡館的等級，至少我點的餐點沒有一樣地雷，用餐環境超舒適，情侶約會或多人聚餐都超適合，最後重點是價格便宜CP 值超高，有兩人或多人套餐可選擇，一人用餐也有個人套餐，沒有用餐時間限制，酒類飲品百百種，服務超親切，如果以泰菜餐廳來說，我在泰食貳館幾乎找不到缺點，上網爬文後才知道他們還有泰食ㄧ館、洋食館，但感覺上這家貳館最讚',
      time: 1617691849
    },
    {
      author_name: '艾莉思（Iris）',
      author_url: 'https://www.google.com/maps/contrib/117841117623447750012/reviews',
      language: 'zh-Hant',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a-/AOh14GgaFjOwmtVfO5Xi_oArT2aOWx2DAsfp6ddJiEMn7Q=s128-c0x00000000-cc-rp-mo',
      rating: 5,
      relative_time_description: '3 週前',
      text:
        '雙人經濟套餐cp值很高！\n餐點整體味道都很順口\n差一點追加白飯\n份量的部分兩個大人吃剛剛好\n加購的金錢蝦餅超級紮實\n每一口都可以滿足的吃到蝦肉很驚艷\n當天有帶小孩\n店家已經到中餐打烊時間\n但不會驅趕客人\n店員態度親切覺得感人🥺\n值得推薦\n有機會也會再回訪❤️',
      time: 1619130825
    },
    {
      author_name: '양안첩',
      author_url: 'https://www.google.com/maps/contrib/113962529782778201772/reviews',
      language: 'zh-Hant',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a-/AOh14GgoxyWlXKm26y-IUmF4cskMixXgsTBNTH6iS2b4VA=s128-c0x00000000-cc-rp-mo-ba4',
      rating: 5,
      relative_time_description: '1 週前',
      text:
        '裝潢非常用心的感覺\n店內乾淨又明亮\n沙發椅坐起來超舒適\n裝熱茶的茶壺也很有質感✨✨\n老闆娘(?)和員工們都好親切♥️\n\n我覺得蝦餅最好吃!!!\n然後滿特別的是這家打拋豬肉是炒濕的\n平常不太吃辣的人應該也能接受~~\n泰奶是手搖的歐🤗很香 可以點無糖的👌🏻',
      time: 1619871318
    },
    {
      author_name: 'Kendall L.',
      author_url: 'https://www.google.com/maps/contrib/113430474939054680432/reviews',
      language: 'zh-Hant',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a/AATXAJzWIZ7AavHXgluhcRchVoPWLEh17QEpqWWaFzc5=s128-c0x00000000-cc-rp-mo',
      rating: 2,
      relative_time_description: '本週',
      text:
        '看得出來店家的用心：裝潢漂亮，環境整潔，但就是不會做飯。 炸雞炸得硬又死鹹，嚐不到香料的味道只吃得到鹽。炒河粉濕又沒味道，清蒸檸檬魚不入味（魚的眼睛還是黃綠色的），奶昔水水的。上菜速度慢。服務生態度好但是水要自己倒，所以其實沒有什麼服務可言。',
      time: 1620472170
    }
  ]
};
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

const Img = styled.img`
  width: 16px;
  height: 16px;
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
  width: 32px;
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

function renderStar(data, newArray) {
  if (data) {
    // newArray = [];
    let length = Math.floor(data);

    for (let i = 0; i < length; i++) {
      const star = <Img src="/active_star.png" alt=""></Img>;
      newArray.push(star);
    }
    if (data % length !== 0) {
      for (let i = 0; i < 1; i++) {
        const star = <Img src="/half_star.png" alt=""></Img>;
        newArray.push(star);
      }
      for (let i = 0; i < 4 - length; i++) {
        const star = <Img src="/default_star.png" alt=""></Img>;
        newArray.push(star);
      }
    } else {
      for (let i = 0; i < 5 - length; i++) {
        const star = <Img src="/default_star.png" alt=""></Img>;
        newArray.push(star);
      }
    }
  }
}

function StoreDetail(props) {
  let starArry = [];

  let URL = <div></div>;
  let OpenStatu = <div></div>;
  let websites = <div></div>;
  let websitesURL = '';
  let deliverSite = '';
  let deliverSiteTag = <div></div>;
  let typesCheck = props.product.types.includes('food');
  let showType = <div></div>;
  const [selectedTab, setSelectedTab] = React.useState('information');

  renderStar(props.product.rating, starArry);

  if (props.product.photos.length !== 0) {
    URL = <StoreImg alt="" src={props.product.photos[0].getUrl()}></StoreImg>;
  }

  if (props.product.opening_hours !== undefined) {
    const today = new Date().getDay();
    //
    if (props.product.opening_hours.weekday_text) {
      const timestamp = props.product.opening_hours.weekday_text[today].slice(5);
      OpenStatu = <InfoDetail>營業中：{timestamp}</InfoDetail>;
    } else {
      OpenStatu = <InfoDetail>營業中</InfoDetail>;
    }
  } else {
    OpenStatu = <InfoDetail></InfoDetail>;
  }

  if (props.product.website) {
    websitesURL = props.product.website.split('/');
    websites = (
      <InfoBox>
        <Icon src="/earth.png"></Icon>
        <InfoLink href={props.product.website}>{websitesURL[2]}</InfoLink>
      </InfoBox>
    );
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

  if (typesCheck) {
    if (props.product.deliver.uber || props.product.deliver.foodpanda) {
      showType = (
        <InfoBox>
          <CheckIcon src="/true.png"></CheckIcon> <Info>內用</Info>
          <Info>．</Info>
          <CheckIcon src="/true.png"></CheckIcon> <Info>外帶</Info>
          <Info>．</Info>
          <CheckIcon src="/true.png"></CheckIcon> <Info>外送</Info>
        </InfoBox>
      );
    } else {
      showType = (
        <InfoBox>
          <CheckIcon src="/true.png"></CheckIcon> <Info>內用</Info>
          <Info>．</Info>
          <CheckIcon src="/true.png"></CheckIcon> <Info>外帶</Info>
          <Info>．</Info>
          <CheckIcon src="/false.png"></CheckIcon> <Info>外送</Info>
        </InfoBox>
      );
    }
  }

  const AllReviews = [];
  if (props.product.reviews) {
    props.product.reviews.forEach((review) => {
      let reviewArry = [];
      let reviewer = (
        <ReviewerBox>
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

  function handleTabClick(e) {
    if (e.target.id === 'information') {
      setSelectedTab('information');
    } else if (e.target.id === 'menu') {
      setSelectedTab('menu');
    }
  }

  return (
    <Store>
      {URL}
      <StoreTitle>{props.product.name}</StoreTitle>
      <RatingDiv>
        <Info>{props.product.rating}</Info>
        <StarBoxStore>{starArry}</StarBoxStore>
        <Info>{props.product.user_ratings_total} 則評論</Info>
      </RatingDiv>
      <TabBox onClick={handleTabClick}>
        {selectedTab === 'information' ? (
          <TabActive id="information">資訊</TabActive>
        ) : (
          <Tab id="information">資訊</Tab>
        )}
        {selectedTab === 'menu' ? <TabActive id="menu">菜單</TabActive> : <Tab id="menu">菜單</Tab>}
      </TabBox>
      {selectedTab === 'information' ? (
        <div>
          {showType}
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
            {websites}
            <InfoBox>
              <Icon src="/phone.png"></Icon>
              <InfoDetail>{props.product.formatted_phone_number}</InfoDetail>
            </InfoBox>
            <InfoBox>
              <Icon src="/plusCode.png"></Icon>
              <InfoDetail>{props.product.plus_code.compound_code}</InfoDetail>
            </InfoBox>
          </InforList>

          <H3Title>評論摘要</H3Title>
          {AllReviews}
        </div>
      ) : (
        <div></div>
      )}
    </Store>
  );
}

export default StoreDetail;
