const deviceSize = {
  mobileS: 360,
  mobile: 768,
  tablet: 992,
  laptop: 1366,
  desltop: 1920
};

const collectionBasicLists = {
  want: {
    collectName: '想去的地點',
    defaultIcon: '/falg.png',
    activeIcon: '/falg_select.png',
    markerIcon: '/falg_marker.png'
  },
  like: {
    collectName: '喜愛的地點',
    defaultIcon: '/heart.png',
    activeIcon: '/heart_select.png',
    markerIcon: '/heart_marker.png'
  },
  star: {
    collectName: '已加星號的地點',
    defaultIcon: '/active_star.png',
    activeIcon: '/star_select.png',
    markerIcon: '/star_marker.png'
  }
};

const tagType = { default: 'information', second: 'menu' };

export { deviceSize, collectionBasicLists, tagType };
