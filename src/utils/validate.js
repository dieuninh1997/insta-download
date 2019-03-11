const isValidateUrl = (url) => {
  const regex = /instagram.com/;
  return regex.test(url);
};

export {
  isValidateUrl,
};
