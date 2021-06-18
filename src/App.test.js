import { render, screen } from '@testing-library/react';
import App from './App';
import renderer from 'react-test-renderer';
// import { ItemTitle } from './Components/UIComponents/Typography';

test('renders learn react link', async () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

//describe('sum',()=>{
//   ItemTitle('.....title',()=>{
//   ...
// })
// })
