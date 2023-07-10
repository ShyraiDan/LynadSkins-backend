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
	.connect(
		'mongodb+srv://danshirayy:1234567Qq@cluster0.cawe89m.mongodb.net/lynadskins?retryWrites=true&w=majority'
	)
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

app.get('/skins', SkinController.getAll)
app.post('/skins', checkAuth, SkinController.create)
app.get('/myskins', checkAuth, SkinController.getUserSkins)

app.listen(4444, (err) => {
	if (err) {
		return console.log(err)
	}
	console.log('Server Ok')
})
