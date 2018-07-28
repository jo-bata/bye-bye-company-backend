const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const config = require('./config');
const conn = require('./mysql');

module.exports = () => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    const sql = 'SELECT * FROM users WHERE id=?';
    conn.query(sql, [id], function(err, results) {
      if(err) {
        console.log(err);
        done('There is no user.');
      } else {
        done(null, results[0]);
      }
    });
  });

  passport.use('kakao', new KakaoStrategy({
      clientID: config.federation.kakao.client_id,
      callbackURL: config.federation.kakao.callback_url
    },
    function (accessToken, refreshToken, profile, done) {
      loginByThirdparty({
        'id': profile.id,
        'name': profile.username
      }, done);
    })
  );

  function loginByThirdparty(info, done) {
    console.log('provider : ' + info.provider);
    const sql = 'SELECT * FROM users WHERE id=?';
    conn.query(sql, info.id, function (err, results) {
      if (err) {
        return done(err);
      } else {
        if (results.length === 0) {
          // 신규 유저는 회원 가입 이후 로그인 처리
          const sql = 'INSERT INTO users SET ?';
          conn.query(sql, info, function (err, results) {
            if(err){
              return done(err);
            }else{
              console.log('Successful register & login !');
              done(null, info);
            }
          });
        } else {
          //기존유저 로그인 처리
          console.log('Successful login !');
          done(null, results[0]);
        }
      }
    });
  }
};