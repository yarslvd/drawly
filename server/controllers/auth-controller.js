const {StatusCodes, BAD_REQUEST}  = require ('http-status-codes');
const {checkFields}  = require ("../helpers/object-fields");
const {checkPassword, hashPassword}  = require ("../utils/bcrypt");
const {generateAccessToken, generateRefreshToken, verifyToken}  = require( "../utils/jwt");
const {Op}  = require( "sequelize");
const {getUserByToken}  = require ("../helpers/get-user-by-token");
const {createToken}  = require( "../helpers/create-token");
const {users}  = require( "../models/db");
const db = require('../models/db.js');
const {sendLetter} = require('../utils/nodemailer');
const axios = require('axios');

const register = async (req, res) => {
    try {
        if (req.body.provider === 'Google') {
            const token = req.body.token;
            try {
                const { data } = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
                if (data === null) {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        error : 'Failed to make google request'
                    });
                }

                req.body.password = data.sub
                req.body.email = data.email
                req.body.username = data.email.split('@')[0]
                req.body.first_name = data.given_name
                req.body.last_name = data.family_name
                req.body.image = data.picture.slice(0, -6)
            } catch (error) {
                console.error(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error : 'Invalid google token'
                });
            }
        }

        const request = checkFields(req.body, ['username', 'email', 'password'])
        if (!request) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Some fields are missed",
            });
        }

        const [user, isUserCreated] = await db.users.findOrCreate({
            where: {
                [Op.or]: [
                    { username : request.username },
                    { email : request.email },
                ],
            },
            defaults: {
                username : request.username,
                email : request.email,
                password : hashPassword(request.password),
                first_name : req.body.first_name ? req.body.first_name : "",
                last_name : req.body.last_name ? req.body.last_name : "",
                birthdate : req.body.birthdate ? req.body.birthdate : null,
                image : req.body.image ? req.body.image : null,
            }
        });

        if (!isUserCreated) {
            let errMsg = '';
            if (request.username.toLowerCase() === user.dataValues.username.toLowerCase()) {
                errMsg += 'username';
            }
            if (request.email.toLowerCase() === user.dataValues.email.toLowerCase()) {
                if (errMsg.length !== 0) {
                    errMsg += ' and ';
                }
                errMsg += 'email';
            }

            return res.status(StatusCodes.CONFLICT).json({
                error : `User with such ${errMsg} exists`,
            });
        }

        let token = generateRefreshToken(user.dataValues.id, user.dataValues.username, user.dataValues.email);
        const link = `${process.env.SERVER_ADDRESS}:3000/confirm/${token}`;

        let dbToken = await createToken(token, res)
        if (dbToken === null) {
            return
        }

        let message = `
            <div style='display: flex; align-items: center; gap: 10px'>
                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 20.0385C40 31.1055 31.0457 40.0771 20 40.0771C8.9543 40.0771 0 31.1055 0 20.0385C0 14.9985 1.85709 10.3931 4.92308 6.87176C7.41833 4.00589 10.7143 1.85803 14.4615 0.778275C16.2203 0.271491 18.0785 0 20 0C21.4789 0 22.9203 0.160822 24.3077 0.465964C27.9618 1.26962 31.2416 3.07434 33.8462 5.57864C37.639 9.22544 40 14.3557 40 20.0385Z" fill="#1F1F1F"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.4615 0.778275V12.3622C14.4615 13.9448 14.8205 15.1676 15.5385 16.0308C16.2564 16.894 17.3128 17.3256 18.7077 17.3256C19.7538 17.3256 20.7282 17.1098 21.6308 16.6782C22.5538 16.2466 23.4462 15.6403 24.3077 14.8593V0.465964C27.9618 1.26962 31.2416 3.07434 33.8462 5.57864V24.0462H27.9385C26.7487 24.0462 25.9692 23.5119 25.6 22.4432L25.0154 20.5934C24.4 21.1895 23.7641 21.7341 23.1077 22.2274C22.4513 22.7001 21.7436 23.1111 20.9846 23.4605C20.2462 23.7893 19.4462 24.0462 18.5846 24.2312C17.7231 24.4367 16.7795 24.5395 15.7538 24.5395C14.0103 24.5395 12.4615 24.2415 11.1077 23.6455C9.77436 23.0289 8.64615 22.176 7.72308 21.0867C6.8 19.9974 6.10256 18.7129 5.63077 17.2331C5.15897 15.7534 4.92308 14.1297 4.92308 12.3622V6.87176C7.41833 4.00589 10.7143 1.85803 14.4615 0.778275Z" fill="white"/>
                </svg>
                <h2 style='font-size: 24px; font-family: Verdana , sans-serif; font-weight: 600; color:#1F1F1F; margin: 0'>uevent</h2>
            </div>
            <br>
            <h1 style='font-size: 26px; font-family: Verdana;'>Email Confirmation</h1>
            <p>We just need one small favor from you - please confirm your email to continue.</p><br><br>
            <a href='${link}' target='_blank' style='outline:none; background-color:#1F1F1F; font-size: 16px; color: #fff; border: none; padding: 10px 60px; border-radius: 10px; margin: 10px 0;'>Confirm</a><br><br>
        `;
        sendLetter(user.dataValues.email, "Confirm email", message);

        await login(req, res)
    }
    catch(error) {
        console.log("Some error while register: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while register: " + error.message
        });
    }
}

const login = async (req, res) => {
    try {
        if (req.body.provider === 'Google') {
            const token = req.body.token;
            try {
                const { data } = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
                if (data === null) {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        error : 'Failed to make google request'
                    });
                }

                req.body.password = data.sub
                req.body.email = data.email
            } catch (error) {
                console.error(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error : 'Invalid google token'
                });
            }
        }

        const request = checkFields(req.body, ['email', 'password']);
        if (!request) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Some fields are missed",
            });
        }

        const user = await users.findOne({
            where: {
                email : request.email
            }
        });

        if (user === null) {
            res.status(StatusCodes.NOT_FOUND).json({
                error : "No such user"
            })

            return
        }

        const isCorrectPass = await checkPassword(request.password, user.dataValues.password);

        if (!isCorrectPass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error : "Wrong password"
            })
        }

        const accessToken = generateAccessToken(user.dataValues.id, user.dataValues.login);
        const refreshToken = generateRefreshToken(user.dataValues.id, user.dataValues.login);

        let dbToken = await createToken(refreshToken, res)
        if (dbToken === null) {
            return
        }

        res.header("Authorization", `Bearer ${refreshToken}`);

        res.cookie("access_token", accessToken, {httpOnly: true, secure: false, sameSite: 'none'});
        res.cookie("refresh_token", refreshToken, {httpOnly: true, secure: false, sameSite: 'none'});

        return res.status(StatusCodes.OK).json ({
            error : null,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            email: user.dataValues.email,
            username: user.dataValues.username,
            image: user.dataValues.image,
            token: accessToken,
        })
    }
    catch (error){
        console.log("Some error while login: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while login: " + error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
      const info = await verifyToken(req.cookies.access_token, req.cookies.refresh_token, res);

      if (!info) {
        res.clearCookie("token");
        return res.status(401).send("Access denied");
      }

      return res.status(200).json(info.dataValues);
    } catch (err) {
      console.log(err);
      res.status(500).send("Access denied");
    }
};

const refresh = async (req, res) => {
    try {
        // console.log(req.body);
        const request = checkFields(req.body, ['refresh_token'])
        if (!request) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Some fields are missed",
            });
        }

        const user = await verifyToken(request.refresh_token)
        if (user === null) {
            return
        }

        await db.tokens.destroy({
            where: {
                token: request.refresh_token,
            }
        });

        const accessToken = generateAccessToken(user.dataValues.id, user.dataValues.login);
        const refreshToken = generateRefreshToken(user.dataValues.id, user.dataValues.login);

        let dbToken = await createToken(refreshToken, res)
        if (dbToken === null) {
            return
        }

        res.header("Authorization", `Bearer ${refreshToken}`);

        res.cookie("access_token", accessToken, {httpOnly: true, secure: false, sameSite: 'none'});
        res.cookie("refresh_token", refreshToken, {httpOnly: true, secure: false, sameSite: 'none'});

        return res.status(StatusCodes.OK).json ({
            error : null,
            access_token : accessToken,
            refresh_token : refreshToken,
        })
    }
    catch (error){
        console.log("Some error while refresh: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while refresh: " + error.message
        });
    }
};

const logout = (req, res) => {
    if (!req.get("Authorization")) {
        return res.status(StatusCodes.UNAUTHORIZED).json ({
            error : 'User is not authorized'
        })
    }

    res.header("Authorization", "");
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.sendStatus(StatusCodes.NO_CONTENT);
}

const emailConfirm = async (req, res) => {
    try {
        const token = req.params.confirm_token;
        // console.log(token)
        let user = await getUserByToken(token, res);
        // console.log(user);
        if (user === null) {
            return;
        }

        if (user.confirmedEmail) {
            return res.status(StatusCodes.OK).json ({
                error : null,
                user : user,
                message : "email was confirmed"
            });
        }

        await db.users.update({ confirmed_email: true }, {
            where : {
                id: user.dataValues.id,
            }
        });
        
        await db.tokens.destroy({
            where: {
                token: token,
            }
        });
        
        user.confirmedEmail = true;

        return res.status(StatusCodes.OK).json ({
            error : null,
            user : user,
            message : "email was confirmed"
        });
    }
    catch (error){
        console.log("Some error while confirming email: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while confirming email: " + error.message
        });
    }
};

const checkToken = async (req, res) => {
    try {
        const token = req.params.confirm_token;

        let user = await getUserByToken(token, res)
        if (user === null) {
            return
        }

        return res.status(StatusCodes.OK).json ({
            error : null,
            message : "token ok"
        });
    }
    catch(error) {
        console.log("Some error while checking the token: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while checking the token: " + error.message
        });
    }
}

const passwordResetConfirm = async(req, res) => {
    try {
        const token = req.params.confirm_token;
        const request = checkFields(req.body, ['password'])
        if (!request) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error : "Some fields are missed",
            });
        }

        let user = await getUserByToken(token, res)
        if (user === null) {
            return
        }

        await db.users.update({ password: hashPassword(request.password) }, {
            where : {
                id: user.dataValues.id,
            }
        });

        await db.tokens.destroy({
            where: {
                token: token,
            }
        });

        return res.status(StatusCodes.OK).json ({
            error : null,
            message : "password was updated"
        });
    }
    catch (error){
        console.log("Some error while confirming reseted password: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while confirming reseted password: " + error.message
        });
    }
};

const passwordReset = async (req, res) => {
    try {
        const request = checkFields(req.body, ['email'])
        if (!request) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error : "Some fields are missed",
            });
        }

        const user = await db.users.findOne({
            where: {
                email : request.email
            }
        });

        if (user === null) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error : "No user with such email",
            })
        }

        let token = generateRefreshToken(user.dataValues.id, user.dataValues.username, user.dataValues.email);
        const link = `${process.env.SERVER_ADDRESS}:3000/reset-password/${token}`;

        let dbToken = await createToken(token, res)
        if (dbToken === null) {
            return;
        }

        let message = `
            <div style='display: flex; align-items: center; gap: 10px'>
                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 20.0385C40 31.1055 31.0457 40.0771 20 40.0771C8.9543 40.0771 0 31.1055 0 20.0385C0 14.9985 1.85709 10.3931 4.92308 6.87176C7.41833 4.00589 10.7143 1.85803 14.4615 0.778275C16.2203 0.271491 18.0785 0 20 0C21.4789 0 22.9203 0.160822 24.3077 0.465964C27.9618 1.26962 31.2416 3.07434 33.8462 5.57864C37.639 9.22544 40 14.3557 40 20.0385Z" fill="#1F1F1F"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.4615 0.778275V12.3622C14.4615 13.9448 14.8205 15.1676 15.5385 16.0308C16.2564 16.894 17.3128 17.3256 18.7077 17.3256C19.7538 17.3256 20.7282 17.1098 21.6308 16.6782C22.5538 16.2466 23.4462 15.6403 24.3077 14.8593V0.465964C27.9618 1.26962 31.2416 3.07434 33.8462 5.57864V24.0462H27.9385C26.7487 24.0462 25.9692 23.5119 25.6 22.4432L25.0154 20.5934C24.4 21.1895 23.7641 21.7341 23.1077 22.2274C22.4513 22.7001 21.7436 23.1111 20.9846 23.4605C20.2462 23.7893 19.4462 24.0462 18.5846 24.2312C17.7231 24.4367 16.7795 24.5395 15.7538 24.5395C14.0103 24.5395 12.4615 24.2415 11.1077 23.6455C9.77436 23.0289 8.64615 22.176 7.72308 21.0867C6.8 19.9974 6.10256 18.7129 5.63077 17.2331C5.15897 15.7534 4.92308 14.1297 4.92308 12.3622V6.87176C7.41833 4.00589 10.7143 1.85803 14.4615 0.778275Z" fill="white"/>
                </svg>
                <h2 style='font-size: 24px; font-family: Verdana , sans-serif; font-weight: 600; color:#1F1F1F; margin: 0'>uevent</h2>
            </div>
            <br>
            <h1 style='font-size: 26px; font-family: Verdana;'>Password Reset</h1>
            <p style='font-family: Verdana; '>Hello, ${req.body.email}. We have received a request to reset the password for your account.
            No changes have been made for your account yet. <b>If you did not request a password reset, ignore this message</b></p><br/>
            <p style='font-family: Verdana;'>Tap on the button to change password</p><br/>
            <a href='${link}' target='_blank' style='outline:none; background-color:#1F1F1F; font-size: 16px; color: #fff;
            border: none; padding: 10px 60px; border-radius: 10px; margin: 10px 0;'>Reset password</a><br><br>
        `;
        sendLetter(request.email, "Password Reset", message);

        return res.status(StatusCodes.ACCEPTED).json({
            error : null,
            message : "accepted reseting password"
        });

    }
    catch (error){
        console.log("Some error while reseting password: ", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json ({
            error : "Some error while reseting password: " + error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    refresh,
    passwordReset,
    emailConfirm,
    passwordResetConfirm,
    getMe,
    checkToken
}
