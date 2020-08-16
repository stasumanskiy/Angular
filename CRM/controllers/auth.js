const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const errorHandler = require('../utils/errorHandler');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports.login = async function (req, res) {
	const candidate = await User.findOne({email: req.body.email});

	if (candidate) {
		// Проверка пaроля, пользователь существует 
		const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);

		if (passwordResult) {
			// Генерация токена, пароли совпали
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id
			}, keys.jwt, {expiresIn: 60 * 60});

			res.status(200).json({
				token: `Bearer ${token}`
			});
		} else {
			// Пароли не совпали
			res.status(401).json({
				message: 'Password does not match please try again.'
			});
		}
		
	} else {
		// Пользователя не сужествует, ошибка
		res.status(404).json({
			message: 'User with this email not found.'
		});
	}
}

module.exports.register = async function (req, res) {
	//email, password
	const candidate = await User.findOne({email: req.body.email});

	if (candidate) {
		// Пользователь существует, вернуть ошибку

		res.status(409).json({
			message: 'This email is already taken, please try another.'
		});
	} else {
		// Нужно создать пользователя
		const salt = bcrypt.genSaltSync(10);
		const password = req.body.password;
		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(password, salt)
		});

		try {
			await user.save();
			res.status(201).json(user);
		} catch(e) {
			errorHandler(res, e);
		}
	}
}