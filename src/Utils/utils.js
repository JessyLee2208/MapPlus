function getTopTenItemInArray(NewCollections, callback) {
  const countMethod = NewCollections.length / 10;
  const count = parseInt(countMethod);

  let rule = count === 0 ? 1 : count;

  for (let i = 0; i < rule; i++) {
    let newArray = NewCollections.slice(0, 10);
    newArray.forEach(async (collect) => {
      callback(collect);
    });
  }

  return;
}

export { getTopTenItemInArray };
