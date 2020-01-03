const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send(`hello from index`);
});

module.exports = router;