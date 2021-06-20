import React from 'react';
import ReactDOM from 'react-dom';
import { act } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import NotFound from './NotFount';

let container;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

it('reders button correctly', () => {
  act(() => {
    ReactDOM.render(<NotFound searchText="漢堡" />, container);
  });
  const label = container.querySelector('div');
  expect(label.textContent).toBe(
    'Google 地圖找不到「漢堡」請確認你的搜尋字詞沒有任何錯別字。嘗試新增食物名稱或是食物種類'
  );
});
