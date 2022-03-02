const router = require('express').Router()

const authorize = require('./authorize')
const signout = require('./signout')
const unsave = require('./unsave')
const saved = require('./saved')
const save = require('./save')
const me = require('./me')

router.use(authorize)
router.use(signout)
router.use(unsave)
router.use(saved)
router.use(save)
router.use(me)

module.exports = router