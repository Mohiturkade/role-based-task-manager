const express = require("express");
const verityToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware")
const router = express.Router();

//only admin can acces this router
router.get("/admin", verifyToken, authorizeRoles("admin"),  (req, res)=> {
    res.json({message : "Welcome admin"})
})


router.get("/user", verityToken, authorizeRoles("user"), (req, res)=> {
    res.json({message : "Welcome user"})
})

module.exports = router
