const router = require('express').Router();

const conn = require('../config/mysql');

router.post('/:userId/info', function(req, res) {
  const user_info = {
    "user_id": req.params.userId,
    "join_year": req.join_year,
    "join_month": req.join_month,
    "join_day": req.join_day,
    "company_name": req.company_name,
    "department": req.department,
    "position": req.position,
    "resignation_num": 0
  };
  const sql = 'INSERT INTO users_info SET ?';
  conn.query(sql, user, function(err, results) {
    if(err) {
      console.log(err);
      const status = { "status": "500 : Internal Server Error" };
      res.status(500).json(status);
    } else {
      console.log('Successful insert users_info !');
      const status = { "status": "200 : OK" };
      res.json(status);
    }
  });
});

router.get('/:userId/info', function(req, res) {
  const sql = 'SELECT * FROM users_info FROM user_id=?'
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      const status = { "status": "500 : Internal Server Error" };
      res.status(500).json(status);
    } else {
      console.log('Successful select users_info !');
      const user_info = {
        "join_year": results[0].join_year,
        "join_month": results[0].join_month,
        "join_day": results[0].join_day,
        "company_name": results[0].company_name,
        "department": results[0].department,
        "position": results[0].position,
        "resignation_num": results[0].resignation_num
      };
      res.json(user_info);
    }
  });
});

module.exports = router;