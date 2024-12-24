const express = require('express');
const router = express.Router();
const { 
  registerControll, 
  loginControll, 
  homeGetRoute,
  auth,
  allGet,
  homePostRoute, 
  homeDeleteRoute 
} = require('../Controller/allRouteController');

router.get('/:shortUrl', homeGetRoute);

router.get('/',auth, allGet);

router.post('/',auth, homePostRoute);

router.delete('/:id',auth, homeDeleteRoute);

router.post('/login', loginControll);

router.post('/register', registerControll);

module.exports = router;
