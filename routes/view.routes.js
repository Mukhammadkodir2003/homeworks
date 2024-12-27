const { createViewPage } = require("../helpers/create_view_page")

const router = require("express").Router()


router.get("/dictionary", (req, res) => {
    res.render(createViewPage("dictionary"), {
        title:"lug'atlar",
        isDict:true
    })
})
router.get("/topics", (req, res) => {
    res.render(createViewPage("topics"), {
        title:"Topics",
        isTopic:true
    })
});
router.get("/", (req, res) => {
    res.render(createViewPage("index"), {
        title:"asosiy sahifa",
        isHome:true
    })
});
router.get("/author", (req, res) => {
    res.render(createViewPage("author"), {
        title:"mualif",
        isAuthor:true
    })
});
router.get("/login", (req, res) => {
    res.render(createViewPage("login"), {
        title:"login",
        isLogin:true
    })
});
router.get("/register", (req, res) => {
    res.render(createViewPage("register"), {
        title:"Register",
        isRegister : true
    })
})
router.get("/adminLogin", (req, res) => {
    res.render(createViewPage("adminLogin"), {
        title:"adminLogin",
        isadminLogin : true
    })
})

module.exports = router;
