import express from 'express'
const router = express.Router()

import authorize from './authorize'
import signout from './signout'
import unsave from './unsave'
import saved from './saved'
import save from './save'
import me from './me'

router.use(authorize)
router.use(signout)
router.use(unsave)
router.use(saved)
router.use(save)
router.use(me)

export default router