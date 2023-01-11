const expressAsyncHandler = require("express-async-handler");
const connection = require("../db/init");
const DisCount = require("../models/Discount.model");

const getAllDiscount= expressAsyncHandler(async (req, res)=> {
    try {
        const [discount]= await connection.execute("SELECT discounts.id, discounts.dateStart, discounts.dateEnd, filmId, films.movieName, discounts.percent FROM discounts INNER JOIN films ON films.id = discounts.filmId")
        return res.status(200).json(discount)
    } catch (error) {
        return res.status(404).json(error.message)
    }
})

const updateDiscount= expressAsyncHandler(async (req, res)=> {
    try {
        const discount= await DisCount.update(
            {...req.body },
            {where: {id: req.params.id}}
        )
        return res.status(200).json(discount)
    } catch (error) {
        return res.status(404).json(error.message)
    }
})

const detailDiscount= expressAsyncHandler(async (req, res)=> {
    try {
        const {id}= req.params
        const [detail]= await connection.execute("SELECT discounts.id, discounts.dateStart, discounts.dateEnd, filmId, films.movieName, discounts.percent FROM discounts INNER JOIN films ON films.id = discounts.filmId WHERE discounts.id = ?", [id])
        return res.status(200).json(detail[0])
    } catch (error) {
        return res.status(404).json(error.message)
    }
})

const createDiscount= expressAsyncHandler(async(req, res)=>{ 
    try {
        const newDiscount= await DisCount.create(req.body)
        return res.status(200).json(newDiscount)
    } catch (error) {
        return res.status(404).json(error.message)
        
    }
})

const discountByFilm= expressAsyncHandler(async(req, res)=> {
    try {
        const {idFilm}= req.query
        const discount= await DisCount.findAll({where: {filmId: idFilm}})
        return res.status(200).json(discount)
    } catch (error) {
        return res.status(404).json(error.message)
    }
})

module.exports= {
    getAllDiscount,
    updateDiscount,
    detailDiscount,
    createDiscount,
    discountByFilm
}