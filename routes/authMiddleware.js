module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("req.user");
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}

module.exports.isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        console.log("req user\n",req.user);
        res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
    }
}