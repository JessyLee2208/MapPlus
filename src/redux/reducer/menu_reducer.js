const initState = {
  selectedDish: {}
};
export default function menuReducer(preState = initState, action) {
  const { type, data } = action;
  switch (type) {
    case 'setSelectedDish':
      return {
        selectedDish: data
      };

    default:
      return preState;
  }
}
