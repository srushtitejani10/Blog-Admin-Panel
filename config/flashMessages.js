module.exports.setFlash = function(req,res,next){
    res.locals.flash={
        'success':req.flash('success'),
        'info':req.flash('info'),
        'error':req.flash('error')
    }
    next()
}
