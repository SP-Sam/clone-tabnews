const status = (request, response) => {
  response.status(200).json({ message: "API em funcionamento!" });
};

export default status;
