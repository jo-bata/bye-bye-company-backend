module.exports = function() {

  var execSync = require('child_process').execSync;
  var fs = require('fs');

  this.parse = function (text, callback) {
      text += "\n";

      fs.writeFileSync('TMP_INPUT_FILE', text, "utf-8");

      var cmd = [
          'mecab',
          'TMP_INPUT_FILE',
          '--output=TMP_OUTPUT_FILE'
      ].join(" ");

      var opt = { encoding: 'utf-8' };
      var res = [];

      try {
          execSync(cmd, opt);
          res = fs.readFileSync('TMP_OUTPUT_FILE', 'utf-8');
      }

      catch(e) {
          console.log(e);
      }

      res = res.replace(/\r/g, "");
      res = res.replace(/\s+$/, "");

      var lines = res.split("\n");

      var res = lines.map(function(line) {
          return line.replace('\t', ',').split(',');
      });

      callback(res);
  };
};