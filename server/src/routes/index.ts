import express from 'express'
const router = express.Router()

import authorize from './authorize'
import bookmark from './bookmark'
import signout from './signout'
import saved from './saved'
import me from './me'

router.use(authorize)
router.use(bookmark)
router.use(signout)
router.use(saved)
router.use(me)

export default router