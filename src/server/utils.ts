export const getRandomItem = (iterable: any) =>
  iterable.get([...iterable.keys()][Math.floor(Math.random() * iterable.size)]);
