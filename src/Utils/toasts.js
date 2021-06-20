import toast from 'react-hot-toast';

const toastStyle = {
  borderRadius: '4px',
  background: '#333',
  color: '#fff'
};

const loginSuccessnNotify = () =>
  toast('成功登入', {
    style: toastStyle
  });

const customNotify = () =>
  toast('正在定位中..請耐心等候', {
    style: toastStyle
  });

const addListNotify = () =>
  toast('成功新增清單', {
    style: toastStyle
  });

const commentSuccessnNtify = () =>
  toast('評論成功', {
    style: toastStyle
  });
const editSuccessNotify = () =>
  toast('評論編輯成功', {
    style: toastStyle
  });

const deleteListNotify = () =>
  toast('成功刪除清單', {
    style: toastStyle
  });

const logOutNotify = () =>
  toast('成功登出', {
    style: toastStyle
  });

const noListNotify = () =>
  toast('目前此清單沒有任何品項', {
    style: toastStyle
  });

export {
  loginSuccessnNotify,
  customNotify,
  addListNotify,
  commentSuccessnNtify,
  editSuccessNotify,
  deleteListNotify,
  logOutNotify,
  noListNotify
};
