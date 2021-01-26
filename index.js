//Dependencias
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session')
//Controller
const categoriesController = require('./categories/categoriesController');
const articleController = require('./articles/articlesController');
const userController = require('./users/UserController')
//Database
const connection = require('./database/database');
const articleModel = require('./articles/Article');
const categoriesModel = require('./categories/Categories');
const userModel = require('./users/User');



//######## Utilizando as importações e dependencias 
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// ##### estabelecendo uma conexão
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão feita com sucesso');
    }).catch((error)=>{
        console.log('Erro: '+error);
    });
// ###### Configurando as sessões e cokies
app.use(session({
    secret:'1sweasdfdsdfdsas',
    cokie:{maxAge: 3000000},
    // os dados das sessões e cokies estão sendo salvos na memoria do seu pc, para aplicações de medio a grande escala o certo é utilizar o Redis (Um banco especialixado em salvamento de sessões e cokies)

}));

//### exportando as rotas
app.use('/',categoriesController);
app.use('/', articleController);
app.use('/', userController );

//##### Rotas 


app.get('/sessions',(req,res)=>{
    req.session.treinamento = 'Fomação Node.js'
    req.session.user={
        email:'gabrielbrune52@gmail.com',
        password:'1234567',
    }
    res.send('Sessão gerada')
})

app.get('/read',(req,res)=>{
    res.json({
        treinamento: req.session.treinamento,
        user: req.session.user
    })

})


app.get('/',(req,res)=>{
    articleModel.findAll({ 
        order:[
            ['id','DESC']
        ],
        limit:4
    }).then(articles =>{
        categoriesModel.findAll({
            limit:4
        }).then(categories =>{
            res.render('index', {articles:articles, categories:categories});
        }).catch(error=>{
            console.log(error)
        })
    }).catch(error=>{
        console.log(error)
    })
});

app.get('/:slug',(req,res)=>{
    let slug = req.params.slug;
    articleModel.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        if(article!= undefined){
            categoriesModel.findAll().then(categories =>{
                res.render('article', {article:article, categories:categories});
            }).catch(error=>{
                console.log(error)
            })
        }else{
            res.redirect('/');
        }
    }).catch(()=>{
        res.redirect('/');
    }).catch(error=>{
        console.log(error)
    })
    
})
app.get('/category/:slug',(req,res)=>{
    let slug = req.params.slug;
    categoriesModel.findOne({
        where:{
            slug:slug
        },
        include: [{model: articleModel}]
    }).then(category=>{
        if(category !=undefined){
            categoriesModel.findAll().then(categories =>{
                res.render('index',{articles:category.articles, categories:categories})
            })

        }else{
            res.redirect('/');
        }
    }).catch((error)=>{
        res.redirect('/');
        console.log('erro:' + error)
    })
})


//####  Servidor

const PORT = process.env.PORT || 3000
app.listen(PORT ,()=>{
    console.log('servidor rodando');
})