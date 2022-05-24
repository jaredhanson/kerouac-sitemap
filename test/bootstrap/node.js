var chai = require('chai');

global.expect = chai.expect;

chai.use(require('chai-kerouac-middleware'));
chai.use(require('chai-kerouac-mapper'));
