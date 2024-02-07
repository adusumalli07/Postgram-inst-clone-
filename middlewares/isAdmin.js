
module.exports= function isAdmin(req, res, next){
    // if(!req.userId.isAdmin)
    //     return res.status(403).json("Access denied");

    const admins= process.env.ADMINS.split(',');
    if(!admins.includes(req.userId)){
        return res.status(403).json("Access denied");
    }
    next();
}