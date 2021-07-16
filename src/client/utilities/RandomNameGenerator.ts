import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
  starWars,
  names
} from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [adjectives, colors, starWars, animals],
  separator: "-",
  length: 2,
};

export const generateName = (length: number) => {
  customConfig.length = length;
  return uniqueNamesGenerator(customConfig);
};
