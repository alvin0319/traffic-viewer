var express = require('express');
var router = express.Router();
const {exec} = require('child_process');

// execute command
/**
 * @param command
 * @returns {Promise<string>}
 */
function cmd(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

/* GET home page. */
router.get('/', async function (req, res, next) {
    const start = new Date(req.query.start ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 3));
    start.setHours(0, 0, 0, 0);
    const end = new Date(new Date(req.query.end ?? new Date()));
    end.setHours(23, 59, 59, 999);

    const result = JSON.parse(await cmd("vnstat --json d"));
    const days = result['interfaces'][0]['traffic']['day'];
    const r = [];
    for (const day of days) {
        const rx = parseInt(day.rx) / 1073741824;
        const tx = parseInt(day.tx) / 1073741824;
        const d = new Date(Date.UTC(day.date.year, day.date.month - 1, day.date.day));
        if (d >= start && d <= end) {
            r.push({
                date: d.toISOString().substring(0, 10),
                rx: rx,
                tx: tx
            });
        }
    }
    res.json(r);
});

module.exports = router;
