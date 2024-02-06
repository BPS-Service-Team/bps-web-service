const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow } = require('feathers-hooks-common');
const validate = require('@feathers-plus/validate-joi');

const joiOptions = require('../../utils/joi.options').options();
const Schema = require('../../schemas/configs.schema');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [validate.form(Schema.POST_SCHEMA, joiOptions)],
    update: [disallow('external')],
    patch: [validate.form(Schema.PATCH_SCHEMA, joiOptions)],
    remove: [disallow('external')],
  },

  after: {
    all: [],
    find: [
      async context => {
        const { 'elements.slug': slug } = context.params.query,
          { result } = context;

        if (slug !== undefined) {
          if (result.data.length) {
            let oResult;

            result.data.find(
              item => item.elements.find(
                element => {
                  if (element.slug === slug) {
                    oResult = element;
                  }
                }
              )
            );

            if (oResult) {
              context.result.data = [oResult];
            }
          }
        }
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
