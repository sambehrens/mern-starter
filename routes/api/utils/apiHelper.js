const passport = require('passport');
const mongoose = require('mongoose');
const { httpCodes } = require('../lib/constants');

module.exports = {
  /**
   * Api to create new document
   * @param {Router} router The express router
   * @param {String} modelName  The mongoose model
   * @param {Function[]} middlewares Middleware to run
   * @param postMiddlewares
   */
  create(router, modelName, middlewares = [], postMiddlewares = []) {
    router.post(
      '/',
      passport.authenticate('jwt', { session: false }),
      middlewares,
      (req, res, next) => {
        new mongoose.model(modelName)(req.body)
          .save()
          .then((doc) => {
            req.doc = doc;
            next();
          })
          .catch((err) => {
            res.status(httpCodes.BAD_REQUEST).json(err);
          });
      },
      postMiddlewares,
      (req, res) => res.json(req.doc)
    );
  },

  /**
   * Api to filter all documents in a collection and return results
   * @param {Router} router The express router
   * @param {String} modelName  The mongoose model
   * @param {Function[]} middlewares Middleware to run
   * @param postMiddlewares
   */
  filter(router, modelName, middlewares = [], postMiddlewares = []) {
    router.post(
      '/filter',
      passport.authenticate('jwt', { session: false }),
      middlewares,
      (req, res, next) => {
        mongoose.model(modelName).find(req.body, (err, docs) => {
          if (err) {
            return res.status(httpCodes.BAD_REQUEST).json(err);
          }

          req.doc = docs;
          next();
        });
      },
      postMiddlewares,
      (req, res) => res.json(req.doc)
    );
  },

  /**
   * Api to get single document by id
   * @param {Router} router The express router
   * @param {String} modelName  The mongoose model
   * @param {Function[]} middlewares Middleware to run
   * @param {Function[]} postMiddlewares
   */
  get(router, modelName, middlewares = [], postMiddlewares = []) {
    router.get(
      '/',
      passport.authenticate('jwt', { session: false }),
      middlewares,
      (req, res, next) => {
        mongoose.model(modelName).findById(req.query.id, (err, doc) => {
          if (err) {
            return res.status(httpCodes.BAD_REQUEST).json(err);
          }
          if (!doc) {
            return res.status(httpCodes.NOT_FOUND).json({ _id: `Document id '${req.params.id}' does not exist` });
          }
          req.doc = doc;
          next();
        });
      },
      postMiddlewares,
      (req, res) => res.json(req.doc)
    );
  },

  /**
   * Api to edit a document by id
   * @param {Router} router The express router
   * @param {String} modelName  The mongoose model
   * @param {Function[]} middlewares Middleware to run
   * @param postMiddlewares
   */
  edit(router, modelName, middlewares = [], postMiddlewares = []) {
    router.patch(
      '/:id',
      passport.authenticate('jwt', { session: false }),
      middlewares,
      (req, res, next) => {
        mongoose.model(modelName).findById(req.params.id, (err, doc) => {
          if (err) {
            return res.status(httpCodes.BAD_REQUEST).json(err);
          }
          if (!doc) {
            return res.status(httpCodes.NOT_FOUND).json({ _id: `Document id '${req.params.id}' does not exist` });
          }
          delete req.body._id;
          delete req.body.password;
          delete req.body.accessLevel;
          for (let field in req.body) {
            doc[field] = req.body[field];
          }
          doc
            .save()
            .then((doc) => {
              req.doc = doc;
              next();
            })
            .catch((err) => {
              return res.status(httpCodes.BAD_REQUEST).json(err);
            });
        });
      },
      postMiddlewares,
      (req, res) => res.json(req.doc)
    );
  },

  /**
   * Api to delete a document by id
   * @param {Router} router The express router
   * @param {String} modelName The mongoose model
   * @param {Function[]} middlewares Middleware to run
   * @param postMiddlewares
   */
  delete(router, modelName, middlewares = [], postMiddlewares = []) {
    router.delete(
      '/:id',
      passport.authenticate('jwt', { session: false }),
      middlewares,
      (req, res, next) => {
        mongoose.model(modelName).findByIdAndDelete(req.params.id, (err, doc) => {
          if (err) {
            return res.status(httpCodes.BAD_REQUEST).json(err);
          }
          if (!doc) {
            return res.status(httpCodes.NOT_FOUND).json({ _id: `Document id '${req.params.id}' does not exist` });
          }

          req.doc = doc;
          next();
        });
      },
      postMiddlewares,
      (req, res) => res.json(req.doc)
    );
  },
};
