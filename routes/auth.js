const router = require('express').Router();

const passport = require('passport');
const conn = require('../config/mysql');

router.get('/login', function(req, res) {
  res.send(`
  <div>
    <div class="row">
        <div class="col-md-offset-1 col-md-5">
            <a href="/auth/login/kakao">
                <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"/>
            </a>
        </div>
    </div>
    <div class="col-md-6">
        <div ui-view></div>
    </div>
  </div>
  `);
});

router.get('/login/success', function(req, res) {
  res.send('Succesful Login !');
});

router.get('/login/kakao', passport.authenticate('kakao'));

router.get('/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login'
  })
);

module.exports = router;