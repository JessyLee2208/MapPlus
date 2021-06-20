import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import Modal from './Modal';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Modal></Modal>, div);
});

it('test props hidden is work correct', () => {
  const { getByTestId } = render(<Modal hidden={true} />);
  expect(getByTestId('confimModal')).not.toBeDisabled();
});

// it('test cancel function is working', async () => {
//   // render(<Modal />);
//   const mockOnClick = jest.fn();
//   // const x = screen.getByText('×');
//   const { getByTestId } = render(<Modal onClick={mockOnClick} />);

//   await act(async () => {
//     fireEvent.click(screen.getByText('×'));
//   });
//   expect(mockOnClick).toHaveBeenCalled();
// });
