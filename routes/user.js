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

router.get('/:userId/main', function(req, res) {
  const sql = 'SELECT * FROM users_info FROM user_id=?';
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      const status = { "status": "500 : Internal Server Error" };
      res.status(500).json(status);
    } else {
      const company_name = results[0].company_name;
      const attendance_day = dateDiff(`${results[0].join_year}-${results[0].join_month}-${results[0].join_day}`, new Date());
      const sql = 'SELECT MAX(resignation_id) FROM resignations WHERE user_id=?';
      conn.query(sql, [req.params.userId], function(err, results) {
        if(err | results.length === 0) {
          console.log(err);
          const status = { "status": "500 : Internal Server Error" };
          res.status(500).json(status);
        } else {
          const current_max_resignation_id = results[0].MAX(resignation_id);
          const sql = 'SELECT reason_num FROM resignations WHERE user_id=? AND resignation_id=?';
          conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
            if(err | results.length === 0) {
              console.log(err);
              const status = { "status": "500 : Internal Server Error" };
              res.status(500).json(status);
            } else {
              const current_reason_count = results[0].reason_num;
              const sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id<?';
              conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
                if(err) {
                  console.log(err);
                  const status = { "status": "500 : Internal Server Error" };
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
      res.json(user_info);
    }
  });
});

router.get('/:userId/resignation', function(req, res) {
  const sql = 'SELECT MAX(resignation_id) FROM resignations WHERE user_id=?';
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err | results.length === 0) {
      console.log(err);
      const status = { "status": "500 : Internal Server Error" };
      res.status(500).json(status);
    } else {
      const current_max_resignation_id = results[0].MAX(resignation_id);
      const sql = 'SELECT * FROM resignations WHERE user_id=? AND resignation_id=?';
      conn.query(sql, [req.params.userId, current_max_resignation_id], function(err, results) {
        if(err | results.length === 0) {
          console.log(err);
          const status = { "status": "500 : Internal Server Error" };
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

function dateDiff(_date1, _date2) {
  let diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  let diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

  diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
  diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

  const diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
  diff = Math.ceil(diff / (1000 * 3600 * 24));

  return diff;
}

module.exports = router;