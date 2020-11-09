const express = require('express');
const router = express();
const UsersModel = require('./User')
const bcrypt = require('bcryptjs');

router.get('/admin/users',(req, res)=>{
    UsersModel.findAll().then(users=>{
        res.render('admin/Users/index',{users:users});
    })
})

router.get('/admin/users/create',(req,res)=>{
    UsersModel.findAll().then(email=>{
        
        let arrayEmail = []
        email.forEach(element=>{
            arrayEmail.push(element.email);
        })
        console.log(arrayEmail)
        console.log(email)
        res.render('admin/Users/create',{arrayEmail:arrayEmail});

    })
})
router.get('/login',(req,res)=>{
    
    res.render('admin/users/login')
})

router.get('/logout', (req,res)=>{
    req.session.user = undefined;
    res.redirect('/')
})


    router.post('/users/create', (req,res)=>{
        let email = req.body.email
        let password = req.body.password
        let salt = bcrypt.genSaltSync(10);
        let encrypted = bcrypt.hashSync(password, salt)

        UsersModel.create({
            email:email,
            password:encrypted
            }).then(()=>{
                res.redirect('/admin/users')
            }).catch(error=>{
                console.log(error)
            })
    })

    router.post('/authenticate',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    UsersModel.findOne({
        where:{
            email:email
        }
    }).then(user=>{
        if(user !=undefined){//Se existe um usuário com esse e-mail/ validar senha
            let correct = bcrypt.compareSync(password, user.password)
            
            if(correct){
                req.session.user = {
                    id: user.id,
                    user: user.email
                }
                res.redirect('/admin/articles')
            }else{
                res.redirect('/login')
            }

        }else{
            res.redirect('/login');
        }
    })
})



module.exports = router

//     // let salt = bcrypt.genSaltSync(10);
//     // let encrypted = bcrypt.hashSync(password, salt)

//     // ##### Validando o email
//     UsersModel.findOne({
//         where:{
//             email:email
//         }
//     }).then(user =>{
//        res.send(`${email} )
//     })  
// })