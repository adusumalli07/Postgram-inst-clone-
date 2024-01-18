const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {

    res.redirect('/').json({StatusCode: "201", message: "Logout successfully"});
});


module.exports=router;