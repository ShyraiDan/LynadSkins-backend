import mongoose from 'mongoose'
const SkinSchema = new mongoose.Schema({
	itemName: {
		type: String,
		required: true,
	},
	skinName: {
		type: String,
		required: true,
	},
	exterior: {
		type: String,
		required: true,
	},
	rarity: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	float: {
		type: Number,
		required: true,
	},
	statTrak: {
		type: Boolean,
		required: true,
	},
	souvenir: {
		type: Boolean,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	color: {
		type: Array,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
})

export default mongoose.model('Skin', SkinSchema)
