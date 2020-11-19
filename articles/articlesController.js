const express = require('express');
const router = express.Router();
const categoryModel = require('../categories/Categories');
const articleModel = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middleware/adminAuth');

// Utilizando join com sequelize
router.get('/admin/articles',adminAuth,(req, res)=>{
    articleModel.findAll({
        include:[{model:categoryModel}],
        order:[
            ['id','asc']
        ]
    }).then(articles=>{
        res.render('admin/articles/index',{articles:articles})
    }).catch(error=>{
        console.log(error)
    })
});

router.get('/admin/articles/new', adminAuth,(req, res)=>{
    categoryModel.findAll().then(categories =>{
        res.render('admin/articles/new',{categories:categories});
    }).catch(error=>{
        console.log(error)
    })
});

router.get('/admin/articles/update/:id',adminAuth,(req,res)=>{
    let id = req.params.id;

    articleModel.findByPk(id).then(article =>{
        if(article !=undefined){
            categoryModel.findAll().then(categories =>{
                res.render('admin/articles/edit',{categories:categories, article:article});
            }).catch(error=>{
                console.log(error)
            })
        }
        else{
            res.redirect('/')
        }
    }).catch(error=>{
        console.log('error')
    })
})

router.post('/articles/save',adminAuth ,(req,res)=>{
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    articleModel.create({
        title:title,
        slug: slugify(title),
        body:body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles')
    }).catch(error=>{
        console.log(error);
    })
})

router.post('/articles/delete',adminAuth,(req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            articleModel.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            }).catch(error=>{
                console.log(error)
            })    

        }else{
            res.redirect('/admin/articles')
        }
    }else{
        res.redirect('/articles/update')
    }
})
router.get('/article/page/:num', (req,res)=>{
    let page = req.params.num;
    let offset = 0
    if(isNaN(page) || page ==1){
        let offset = 0
    }else{
        offset = (parseInt(page) -1) * 4;
    }
// ############ Sistema de paginação #############
    articleModel.findAndCountAll({
        limit:4,
        offset: offset,
        order:[
            ['id','DESC']
        ]
    }).then(articles =>{
        let next;
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }

        let result = {
            page:parseInt(page),
            next: next,
            articles:articles,
        }
        categoryModel.findAll().then(categories =>{
            res.render('admin/articles/landingPage',{result: result, categories:categories})
        }).catch(error=>{
            console.log(error)
        })    

        // res.json(result)
    }).catch(error=>{
        console.log(error)
    })    

})


router.post('/article/update',(req,res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category

    // res.send(title +' '+id+' '+category+' '+body)
    articleModel.update({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:category
    },{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('/admin/articles');
    }).catch(error=>{
        console.log(error)
    })    

 })

module.exports = router