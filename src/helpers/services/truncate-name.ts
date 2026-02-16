export const truncateName = (name: string): string => {
  if (name.length > 25) {
    return `${name.slice(0, 20)}...${name.slice(-3)}`;
  } else {
    return name;
  }
};
