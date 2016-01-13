let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../models/user')

module.exports = (app) => {
    passport.serializeUser(nodeifyit(async(user) => user._id))
    passport.deserializeUser(nodeifyit(async(id) => {
        return await User.promise.findById(id)
    }))

    passport.use(new LocalStrategy({
        usernameField: 'username',
        failureFlash: true
    }, nodeifyit(async(username, password) => {
        let user
       
        let email
        if (username.indexOf('@') >= 0) {
            email = username.toLowerCase()
            user = await User.promise.findOne({email})
        } else {
            user = await User.promise.findOne({
                username: {
                    $regex: new RegExp(username, 'i')
                }
            })

        }

        if (!email) {
            if (!user || username != user.username) {
                return [false, {message: 'Invalid username'}]
            }
        } else {
            if (!user || email != user.email) {
                return [false, {message: 'Invalid email'}]
            }
        }

        if (!await user.validatePassword(password)) {
            return [false, {message: 'Invalid password'}]
        }
        return user
    }, {spread: true})))

    /*
     * Passport local strategy for signup
     */

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        failureFlash: true,
        passReqToCallback: true
    }, nodeifyit(async(req, email, password) => {
        console.log('here')
        /* Do email query */
        email = (email || '').toLowerCase()
        if (await User.promise.findOne({email})) {
            return [false, 'That email is already taken.']
        }

        /* set username, title, description from request body to same name parameters*/
        let {username, title, description} = req.body

        /* Do username query*/
        let query = {
            username: {
                $regex: new RegExp(username, 'i')
            }
        }

        if (await User.promise.findOne(query)) {
            return [false, {message: 'That username is already taken.'}]
        }

        let user = new User()
        user.email = email
        user.username = username
        user.blogTitle = title
        user.blogDescription = description
        user.password = password

        await user.save()
        return user
    }, {spread: true})))

    return passport
}
