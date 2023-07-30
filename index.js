import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import { loginValidation, registerValidation } from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'

import { checkAuth, handleValidationErrors } from './utils/index.js'

import {
	PostController,
	SkinController,
	UserController,
} from './Controllers/index.js'

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('DB OK')
	})
	.catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

// auth / login
app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)
app.patch('/auth/me', checkAuth, UserController.update)

app.post('/userMoney', UserController.getMoney)
app.patch('/userMoney', UserController.updateMoney)

// posts
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})
app.get('/posts', PostController.getAll)
app.get('/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)

// skins
app.post('/Nskins', SkinController.getAll)
app.post('/skins', checkAuth, SkinController.create)
app.get('/myskins', checkAuth, SkinController.getUserSkins)
app.patch('/skins/:id', checkAuth, SkinController.updateSkin)

app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		return console.log(err)
	}
	console.log('Server Ok')
})
