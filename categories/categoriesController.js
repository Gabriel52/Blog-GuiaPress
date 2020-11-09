const express = require('express');
const categoryModel = require('./Categories');
const router = express.Router();
const slugify = require('slugify');
const adminAuth = require('../middleware/adminAuth')

router.get('/admin/categories/new',(req,res)=>{
    res.render('admin/categories/new')
});

router.get('/admin/categories',adminAuth,(req,res)=>{
    categoryModel.findAll().then(categories =>{
        res.render('admin/categories/index',{
            categories:categories
        });
    })
})

router.get('/admin/categories/edit/:id',adminAuth,(req, res)=>{
    let id = req.params.id;
    let title = req.body.title;
    
    categoryModel.findByPk(id).then(category =>{
        if(category != undefined){
            res.render('admin/categories/edit',{categoria:category})
        }else{
            res.redirect('/admin/categories');
        }
    }).catch(error=>{
        console.log(error)
        res.redirect('/admin/categories');
    })

})

router.post('/categories/save', adminAuth,(req, res)=>{
    let title = req.body.title;
    if(title != undefined){
        categoryModel.create({
            title:title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories')
        })
    }else{
        res.redirect('/admin/categories/new');
    }

});
// #################### Deletar categoria ####################
router.post('/categories/delete',adminAuth,(req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            categoryModel.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/categories')
            })    

        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }
})

// #################### Atualizar categoria ####################
router.post('/categories/update',adminAuth,(req,res)=>{
    let id = req.body.id;
    let title = req.body.title;

    categoryModel.update({title:title, slug: slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('/admin/categories')
    })
})

module.exports = router;