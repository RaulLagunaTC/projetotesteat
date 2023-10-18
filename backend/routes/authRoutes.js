const router = require ('express').Router();
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

const User = require('../models/user');
const res = require('express/lib/response');

router.post("/register", async(req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;


//testando todos os campos
    if(name == null || email == null || password == null || confirmpassword || null){
    return res.status(400).json({error: "Por favor preencher todos os campos"})
    }

//testando senha
    if(password != confirmpassword){
    return res.status(400).json({error: "As senhas não conferem"})
    }

//testando se o usuario existe
    const emailExists = await User.findOne({email: email});

    if(emailExists){
        return res.status(400).json({error: "O email informado já existe"})
    }

//criando a hash de senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

//criando o úsuario
    const user = new User({
        name: name,
        email: email,
        password: passwordHash
    });

//montando um try catch para pega outros erros e afins
    try {
        const newUser = await user.save();

//criando o token
    const token = jwt.sign({
        name: newUser.name,
        id: newUser._id,
    },"Pênis")

//retomando token
    res.json({error: null, msg: "Você fez o cadastro com sucesso", token: token, userId: newUser._id});
    }catch(error){
        res.status(400).json({error});
        }
        
});

//criando rota de login
    router.post("/login", async(req, res)=>{
        const email = req.body.email;
        const password = req.body.password;
        
//usuario exite
    const user = await User.findOne({email: email});

        if(!user){
            return res.status(400).json({error: "Email não cadastrado, úsuario não existe"})
        }

//testando a senha
    const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(400).json({error: "Senha inválida"});
        }

//usuario cadastro, gerando token
    const token = jwt.sign({
        name : user.name,
        id : user._id
        },"Pênis"
    );

//retornando o token e mensagem de autorização
    res.json({error : null, msg : "Você esta logado!!!", token: token, userId: user._id})
            
    });

module.exports = router;