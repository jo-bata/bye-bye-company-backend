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
  const result = `{ "userId": "${req.user.id}"}`
  res.send(result);
});

router.get('/login/fail', function(req, res) {
  console.log('/auth/login/fail!!!');
  res.send('Login Failed !');
});

router.get('/login/kakao', passport.authenticate('kakao'));

router.get('/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login/fail'
  })
);

router.post('/register', function(req, res) {
  const user = {
    "id": req.body.id,
    "name": req.body.name
  };
  console.log(`id : ${user.id}, name : ${user.name}`);
  const sql = 'INSERT INTO users SET ?';
  conn.query(sql, user, function(err, results) {
    if(err) {
      console.log(err);
      console.log(1);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      const sql = "INSERT INTO resignations SET ?";
      const resignation = {
        "resignation_id": 1,
        "user_id": user.id,
        "reason_num": 0
      };
      conn.query(sql, resignation, function(err, results) {
        if(err) {
          console.log(err);
          console.log(2);
          const status = { "status": "500" };
          res.status(500).json(status);
        } else {
          console.log('Succesful register !');
          console.log(`id : ${user.id}, name : ${user.name}`);
          const status = { "status": "200" };
          res.json(status);
        }
      });
    }
  });
});

module.exports = router;