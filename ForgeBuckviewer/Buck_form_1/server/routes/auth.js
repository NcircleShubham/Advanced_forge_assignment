const express = require('express');
const { getPublicToken } = require('../services/aps.js');

let router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        res.json(await getPublicToken());
        console.log("Hero")

    } catch (err) {
        next(err);
    }
});

module.exports = router;

