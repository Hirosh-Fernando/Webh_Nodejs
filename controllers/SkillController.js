const Skill = require('../models/SkillModel');

const createSkill = async (req, res, next) => {
	const { title, desc, imageUrl } = req.body;

	const newSkill = new Skill({
		desc: desc,
		title: title,
		image:imageUrl
	});

	try {
		await newSkill.save();
	} catch (err) {
		return next(err);
	}
	res.json(newSkill);
};

const getSkills = async (req, res, next) => {
	let skills;

	try {
		skills = await Skill.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(skills);
};

const getSkill = async (req, res, next) => {
	const { id } = req.params;
	let skill;
	try {
		skill = await Skill.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(skill);
};

const deleteSkill = async (req, res, next) => {
	const id = req.params.id;
	let skill;
	try {
		skill = await Skill.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await skill.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted skill' });
};

const updateSkill = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let skill;
	try {
		skill = await Skill.findById(id);
	} catch (err) {
		return next(err);
	}

	skill.title = title;
	skill.desc = desc;
	skill.image = image;

	try {
		await skill.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		skill
	);
};

exports.getSkills = getSkills;
exports.getSkill = getSkill;
exports.createSkill = createSkill;
exports.updateSkill = updateSkill;
exports.deleteSkill = deleteSkill;
