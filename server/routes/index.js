const router = require('express').Router()

module.exports = (controllers) => {
  router.get('/api/saved/:username', controllers.saved)
  router.get('/api/authorize', controllers.authorize)
  router.get('/api/me', controllers.me)

  router.post('/api/signout', controllers.signout)
  router.post('/api/unsave', controllers.unsave)
  router.post('/api/save', controllers.save)

  return router
}