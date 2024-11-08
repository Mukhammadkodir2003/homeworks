const error_handler = (res, error) => {
  console.log(error);
  res.status(400).send({ error: error.message });
};

module.exports = {
  error_handler,
};
