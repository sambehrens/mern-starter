const { httpCodes } = require('../lib/constants');

module.exports = {
  sendDoc(req, res) {
    if (req.doc) {
      return res.json(req.doc);
    }

    return res.status(httpCodes.SUCCESS_N0_CONTENT).send();
  },
};
