const ctrl = {};

const {Image} = require('../models')
const sidebar = require('../helpers/sidebar')

ctrl.index = async (req, res) => {
    try {
        const images = await Image.find().sort({ timestamp: -1 });
        let viewmodel = await sidebar({ images });
        res.render('index', viewmodel);
    } catch (error) {
        console.error('Error en el controlador index:', error);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = ctrl
