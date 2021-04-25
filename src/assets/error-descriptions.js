const errorDescr = {
  resourceNotFound: {
    errorName: 'Base error',
    errorDescrioption: 'Could not found requested resource',
  },
  noData: {
    errorName: 'Network Error',
    errorDescrioption: 'Could not receive data from server',
  },
  noGenreConfig: {
    errorName: 'Network Error',
    errorDescrioption: "Can't get genre config",
  },
  noSessionId: {
    errorName: 'Error',
    errorDescrioption: "Can't get session ID",
  },
};

export default errorDescr;
