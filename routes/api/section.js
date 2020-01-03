const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send(`hello from api/section : current user = ${req.user.email}`);
});

module.exports = router;