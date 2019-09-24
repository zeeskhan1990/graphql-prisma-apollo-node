import "@babel/polyfill/noConflict"
import server from './server'

//process.env.PORT is defined by Heroku in prod
server.start({port:process.env.PORT || 4600}, () => {
    console.log('The server is running')
})