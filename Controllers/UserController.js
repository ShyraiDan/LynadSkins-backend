import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '1d',
			}
		)

		const { passwordHash, ...userData } = user._doc
		res.json({ ...userData, token })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Regestration failed' })
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)
		if (!isValidPass) {
			return res.status(400).json({ message: 'Login or password incorrect' })
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '1d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Auth failed' })
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const { passwordHash, ...userData } = user._doc
		res.json(userData)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'No access' })
	}
}

export const update = async (req, res) => {
	try {
		await UserModel.updateOne(
			{ _id: req.body._id },
			{
				avatarUrl: req.body.avatarUrl,
				money: req.body.money,
			}
		).then(() =>
			res.json({
				success: true,
			})
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'User updating failed' })
	}
}
// get
export const getMoney = async (req, res) => {
	try {
		await UserModel.findById(req.body._id).then(({ money }) => res.json(money))
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Money getting failed' })
	}
}
// patch
export const updateMoney = async (req, res) => {
	try {
		await UserModel.updateOne(
			{ _id: req.body._id },
			{
				money: req.body.money,
			}
		).then(() =>
			res.json({
				success: true,
			})
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'User updating failed' })
	}
}
