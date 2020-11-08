const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')).toString());

const result = data.map((item) => ({
  area: item.area,
  position: item.position_name
}));

fs.writeFile(path.resolve(__dirname, 'result.json'), JSON.stringify(result, null, 2), () => {});
