const router = require('express').Router();

const conn = require('../config/mysql');
const Mecab = require('../config/mecab-mod');
const mecab = new Mecab();

router.post('/:userId/info', function(req, res) {
  const user_info = {
    "user_id": req.params.userId,
    "join_year": req.body.join_year,
    "join_month": req.body.join_month,
    "join_day": req.body.join_day,
    "company_name": req.body.company_name,
    "department": req.body.department,
    "position": req.body.position,
    "resignation_num": 0
  };
  const sql = 'INSERT INTO users_info SET ?';
  conn.query(sql, user_info, function(err, results) {
    if(err) {
      console.log(err);
      console.log(3);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      console.log('Successful insert users_info !');
      const status = { "status": "200" };
      res.json(status);
    }
  });
});

router.get('/:userId/info', function(req, res) {
  const sql = 'SELECT * FROM users_info FROM user_id=?'
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      console.log(4);
      const status = { "status": "500" };
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

router.get('/:userId/main', function(req, res) {
  const sql = 'SELECT * FROM users_info WHERE user_id=?';
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      console.log(5);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      const company_name = results[0].company_name;
      const attendance_day = dateDiff(`${results[0].join_year}-${results[0].join_month}-${results[0].join_day}`, new Date());
      const sql = "SELECT MAX(resignation_id) AS 'max_resignation_id' FROM resignations WHERE user_id=?";
      conn.query(sql, [req.params.userId], function(err, results) {
        if(err | results.length === 0) {
          console.log(err);
          console.log(6);
          const status = { "status": "500" };
          res.status(500).json(status);
        } else {
          const current_max_resignation_id = results[0].max_resignation_id;
          console.log(current_max_resignation_id);
          const sql = 'SELECT reason_num FROM resignations WHERE user_id=? AND resignation_id=?';
          conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
            if(err | results.length === 0) {
              console.log(err);
              console.log(7);
              const status = { "status": "500" };
              res.status(500).json(status);
            } else {
              const current_reason_count = results[0].reason_num;
              const sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id<?';
              conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
                if(err) {
                  console.log(err);
                  console.log(8);
                  const status = { "status": "500" };
                  res.status(500).json(status);
                } else if(results.length === 0){
                  const resignations = [];
                  const main = {
                    "company_name": company_name,
                    "attendance_day": attendance_day,
                    "current_reason_count": current_reason_count,
                    "resignation": resignations
                  };
                  res.json(main);
                } else {
                  const resignations = [];
                  for(let i = 0; i < results.length; i++) {
                    const result = {
                      "resignation_id": results[i].resignation_id,
                      "first_reason": results[i].first_reason,
                      "second_reason": results[i].second_reason,
                      "third_reason": results[i].third_reason,
                      "date": results[i].date
                    };
                    resignations.push(result);
                  }
                  const main = {
                    "company_name": company_name,
                    "attendance_day": attendance_day,
                    "current_reason_count": current_reason_count,
                    "resignation": resignations
                  };
                  res.json(main);
                }
              });
            }
          });
        }
      });
    }
  });
});

router.get('/:userId/resignation', function(req, res) {
  const sql = "SELECT MAX(resignation_id) AS 'max_resignation_id' FROM resignations WHERE user_id=?";
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      console.log(9);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      const current_max_resignation_id = results[0].max_resignation_id;
      const sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id=?';
      conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
        if(err | results.length === 0) {
          console.log(err);
          console.log(10);
          const status = { "status": "500" };
          res.status(500).json(status);
        } else {
          const current_resignation = {
            "first_reason": results[0].first_reason,
            "second_reason": results[0].second_reason,
            "third_reason": results[0].third_reason,
            "current_reason_count": results[0].reason_num
          };
          res.json(current_resignation);
        }
      });
    }
  });
});

router.post('/:userId/resignation', function(req, res) {
  const sql = "SELECT MAX(resignation_id) AS 'max_resignation_id' FROM resignations WHERE user_id=?";
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      console.log(11);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      const current_max_resignation_id = results[0].max_resignation_id;
      const sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id=?';
      conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
        if(err | results.length === 0) {
          console.log(err);
          console.log(12);
          const status = { "status": "500" };
          res.status(500).json(status);
        } else {
          const current_reason_count = results[0].reason_num;
            if(current_reason_count < 2) {
              const sql1 = 'UPDATE resignations SET ';
              const sql2 = (current_reason_count === 0) ? 'before_first_reason=?' : 'before_second_reason=?';
              const sql3 = ', reason_num=? WHERE user_id=? AND resignation_id=?';
              conn.query(sql1 + sql2 + sql3, [req.body.reason, (current_reason_count + 1), req.params.userId, current_max_resignation_id], function(err, results) {
                if(err) {
                  console.log(err);
                  console.log(13);
                  const status = { "status": "500" };
                  res.status(500).json(status);
                } else {
                  const status = { "status": "200" };
                  res.status(200).json(status);
                }
              });
            } else {
              const sql = 'UPDATE resignations SET before_third_reason=?, reason_num=?, date=? WHERE user_id=? AND resignation_id=?';
              const before_date = new Date();
              const after_date = `${before_date.getFullYear()}-${before_date.getMonth() + 1}-${before_date.getDate()}`;
              conn.query(sql, [req.body.reason, (current_reason_count + 1), after_date, req.params.userId, current_max_resignation_id], function(err, results) {
                if(err) {
                  console.log(err);
                  console.log(14);
                  const status = { "status": "500" };
                  res.status(500).json(status);
                } else {
                  const status = { "status": "200"};
                  res.status(200).json(status);
                }
              });
            }
          }
      });
    }
  });
});

router.get('/:userId/resignation/submit', function(req, res) {
  const sql = "SELECT MAX(resignation_id) AS 'max_resignation_id' FROM resignations WHERE user_id=?";
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      console.log(15);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      const current_max_resignation_id = results[0].max_resignation_id;
      const sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id=?';
      conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
        if(err | results.length === 0) {
          console.log(err);
          console.log(16);
          const status = { "status": "500" };
          res.status(500).json(status);
        } else {
          const first_reason = results[0].after_first_reason;
          const second_reason = results[0].after_second_reason;
          const third_reason = results[0].after_third_reason;
          const date = results[0].date.split('-');
          const join_year = date[0];
          const join_month = date[1];
          const join_day = date[2];
          const sql = 'SELECT * FROM users_info WHERE user_id=?';
          conn.query(sql, [req.params.userId], function(err, results) {
            if(err | results.length === 0) {
              console.log(err);
              console.log(17);
              const status = { "status": "500" };
              res.status(500).json(status);
            } else {
              const department = results[0].department;
              const position = results[0].position;
              const sql = 'SELECT * FROM users WHERE user_id=?';
              conn.query(sql, [req.params.userId], function(err, results) {
                if(err | results.length === 0) {
                  console.log(err);
                  console.log(18);
                  const status = { "status": "500" };
                  res.status(500).json(status);
                } else {
                  const name = results[0].name;
                  const sql = 'INSERT INTO resignations SET ?';
                  const resignation = {
                    "resignation_id": current_max_resignation_id+1,
                    "user_id": req.params.userId,
                    "reason_num": 0
                  };
                  conn.query(sql, resignation, function(err, results) {
                    if(err | results.length === 0) {
                      console.log(err);
                      console.log(19);
                      const status = { "status": "500" };
                      res.status(500).json(status);
                    } else {
                      const final_resignation = {
                        "department": department,
                        "position": position,
                        "name": name,
                        "first_reason": first_reason,
                        "second_reason": second_reason,
                        "thrid_reason": third_reason,
                        "join_year": join_year,
                        "join_month": join_month,
                        "join_day": join_day
                      };
                      res.json(final_resignation);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

router.get('/:userId/resignation/:resignationId', function(req, res) {
  sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id=?';
  conn.query(sql, [req.params.userId, req.params.resignationId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      console.log(20);
      const status = { "status": "500" };
      res.status(500).json(status);
    } else {
      const resignation = {
        "before_first_reason": results[0].before_first_reason,
        "before_second_reason": results[0].before_second_reason,
        "before_third_reason": results[0].before_third_reason,
        "after_first_reason": results[0].after_first_reason,
        "after_second_reason": results[0].after_second_reason,
        "after_third_reason": results[0].after_third_reason,
        "date": results[0].date
      };
      res.json(resignation);
    }
  });
});

function dateDiff(_date1, _date2) {
  let diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  let diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

  diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
  diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

  let diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
  diff = Math.ceil(diff / (1000 * 3600 * 24));

  return diff;
}

module.exports = router;