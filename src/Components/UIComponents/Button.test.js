import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup, fireEvent, act } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import { ButtonPrimaryRound } from './Button';
// import 'jest-dom/extend-expect';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ButtonPrimaryRound></ButtonPrimaryRound>, div);
});

it('reders button correctly', () => {
  const { getByTestId } = render(<ButtonPrimaryRound children="登入"></ButtonPrimaryRound>);
  expect(getByTestId('primaryRoundButton')).toHaveTextContent('登入');
});

it('call the mockfunction', async () => {
  const mockOnClick = jest.fn();
  const { getByTestId } = render(<ButtonPrimaryRound onClick={mockOnClick} />);

  await act(async () => {
    fireEvent.click(getByTestId('primaryRoundButton'));
  });

  expect(mockOnClick).toHaveBeenCalled();
});
