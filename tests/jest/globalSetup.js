//These global setup files are not processed by babels as test files are
require('@babel/polyfill/noConflict')
/* require('core-js/stable')
require('regenerator-runtime') */

const server = require('../../src/server').default
module.exports = async () => {
    global.httpServer = await server.start({port: 4800})
}