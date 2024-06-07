const express = require('express')
const router = express.Router()
const Vuelo = require('../models/vuelo')

//Funcion para obtener todos los vuelos desde localhost:3001/vuelos/
router.get('/', async (req, res) => {
    try {
        const vuelos = await Vuelo.find()
        res.json(vuelos)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Funcion para obtener un vuelo en especifico desde localhost:3001/vuelos/buscar/:id
router.get('/buscar/:id', getVuelo, (req, res) => {
    res.send(res.vuelo)
})

//Funcion para crear un vuelo en la base de datos desde localhost:3001/vuelos/
router.post('/', async (req, res) => {
    vuelo = new Vuelo({
        id: req.body.id,
        origen: req.body.origen,
        destino: req.body.destino,
        fecha: req.body.fecha,
        precio: req.body.precio,
        numEscalas: req.body.numEscalas,
        listaEscalas: req.body.listaEscalas,
        aerolinea: req.body.aerolinea
    })
    try {
        const newVuelo = await vuelo.save()
        res.status(201).json(newVuelo)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Funcion para actualizar un vuelo en la base de datos desde localhost:3001/vuelos/:id con los datos enviados en el body
router.put('/:id', getVuelo, async(req, res) => {
    if (req.body.id != null) {
        res.vuelo.id = req.body.id
    }
    if (req.body.origen != null) {
        res.vuelo.origen = req.body.origen
    }
    if (req.body.destino != null) {
        res.vuelo.destino = req.body.destino
    }
    if (req.body.fecha != null) {
        res.vuelo.fecha = req.body.fecha
    }
    if (req.body.precio != null) {
        res.vuelo.precio = req.body.precio
    }
    if (req.body.numEscalas != null) {
        res.vuelo.numEscalas = req.body.numEscalas
    }
    if (req.body.listaEscalas != null) {
        res.vuelo.listaEscalas = req.body.listaEscalas
    }
    if (req.body.aerolinea != null) {
        res.vuelo.aerolinea = req.body.aerolinea
    }
    try {
        const updatedVuelo = await res.vuelo.save()
        res.json(updatedVuelo)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Funcion para eliminar un vuelo en la base de datos desde localhost:3001/vuelos/:id
router.delete('/:id', getVuelo, async (req, res) => {
    try {
        await res.vuelo.deleteOne()
        res.json({ message: 'Vuelo eliminado' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Funcion para buscar vuelos en la base de datos desde localhost:3001/vuelos/buscar con los parametros enviados en el query
router.get("/buscar", async (req, res) => {
    try {
        console.log("Entre con: ",req.query)
        //const busqueda = req.query.search || ""
        //const id = req.query.id || ""
        let origen = req.query.origen || "All"
        let destino = req.query.destino || "All"
        let fechamin = req.query.fechamin || 0
        let fechamax = req.query.fechamax || 0
        let preciomin = req.query.preciomin || 0
        let preciomax = req.query.preciomax || 0
        let numEscalas = req.query.numEscalas || "All"
        //let listaEscalas = req.query.listaEscalas || "All"
        let aerolinea = req.query.aerolinea || "All"

        const opcionesOrigen = [
            "Cali",
            "Bogota",
            "Medellin"
        ]
        const opcionesDestino = [
            "Cali",
            "Bogota",
            "Medellin"
        ]
        // const opcionesEscala = [
        //     "Cali",
        //     "Bogota",
        //     "Medellin",
        //     ""
        // ]
        const opcionesAerolinea = [
            "Avianca",
            "Viva Air",
            "Latam"
        ]

        origen === "All" ? origen = [...opcionesOrigen] : origen = req.query.origen.split(",")
        destino === "All" ? destino = [...opcionesDestino] : destino = req.query.destino.split(",")
        //listaEscalas === "All" ? listaEscalas = [...opcionesEscala] : listaEscalas = req.query.escala.split(",")
        aerolinea === "All" ? aerolinea = [...opcionesAerolinea] : aerolinea = req.query.aerolinea.split(",")
        numEscalas === "All" ? numEscalas = 100 : numEscalas = numEscalas
        preciomin === 0 ? preciomin = 0 : preciomin = preciomin
        preciomax === 0 ? preciomax = 9999999999 : preciomax = preciomax
        const date = new Date()
        fechamin === 0 ? fechamin = subsOneYear(date) : fechamin = fechamin
        const dateCopy = new Date()
        fechamax === 0 ? fechamax = addTenYear(dateCopy) : fechamax = fechamax
        const vuelos = await Vuelo.find()
        .where('origen').in(origen)
        .where('destino').in(destino)
        .where('fecha').gte(fechamin).lt(fechamax)
        .where('precio').gte(preciomin).lt(preciomax)
        .where('numEscalas').lte(numEscalas)
        // .where('listaEscalas').in(listaEscalas)
        .where('aerolinea').in(aerolinea)

        const total = await Vuelo.countDocuments({
        origen: {$in: origen},
        destino: {$in: destino},
        fecha: {$gte: fechamin, $lt: fechamax},
        precio: {$gte: preciomin, $lt: preciomax},
        numEscalas: {$lte: numEscalas},
        //listaEscalas: {$in: listaEscalas},
        aerolinea: {$in: aerolinea}
        })
        const response = {
            error:false,
            total,
            origen: opcionesOrigen,
            destino: opcionesDestino,
            fechamin,
            fechamax,
            preciomin,
            preciomax,
            numEscalas,
            //listaEscalas: opcionesEscala,
            aerolinea: opcionesAerolinea,
            vuelos
        }
        res.status(200).json(response)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getVuelo(req, res, next) {
    let vuelo
    try {
        vuelo = await Vuelo.findOne({ id: req.params.id })
        if (vuelo == null) {
            return res.status(404).json({ message: 'Vuelo no encontrado' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.vuelo = vuelo
    next()
}
function addTenYear(date) {
    date.setFullYear(date.getFullYear() + 10);
    return date;
  }
function subsOneYear(date) {
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }
module.exports = router