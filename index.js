const express=require('express');
const jwt=require('jsonwebtoken');
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
let user={
    id:"15f5df45",
    email: "abhiramryali94@gmail.com",
    password:"dwjdbwdjdbj;'kdmnwkwmdlwmd",
}

const JWT_SECRET='some super secret...'


app.get('/',(req,res,next)=>{
    res.render('forgot-password');
});

app.post('/',(req,res,next)=>{
    const{email}=req.body;
    //make sure exist in database
    if(email !==user.email){
        res.send('user not exist');
        return;
    }
    
    //user exist  and now create one time link valid for 15min
    const secret=JWT_SECRET + user.password
    const payload={
        email:user.email,
        id:user.id
        }
        const token=jwt.sign(payload,secret,{expiresIn:'15minutes'});
        const link =`http://localhost:3000/reset-password/${user.id}/${token}`;
     
        res.send(link);
        res.send('password reset link sent to email'); 
});

app.get('/reset-password/:id/:token',(req,res,next)=>{
    const {id,token}=req.params;
    //check if id exist in database
    if(id!==user.id){
        res.send('invalid id..')
        return
    }
    //we have valid id  and valid user
    const secret = JWT_SECRET+user.password 
    try{
        const payload=jwt.verify(token,secret)
        res.render('reset-password',{email:user.email})

    }catch (error){
        console.log(error.message);
        res.send(error.message);
    }
});

app.post('/reset-password/:id/:token',(req,res,next)=>{
    const {id,token}=req.params;
    const{password,password2}=req.body
   
    if(id!==user.id){
        res.send('invalid id..')
        return
    }
  const secret=JWT_SECRET+user.password
  
  try{
      const payload=jwt.verify(token,secret)
      //validate password and password2 match
      //we can simply find the user with payload email and id and finally update with new password
      //always hash password
      user.password=password;
      res.send(user);


  }catch(error){
      console.log(error.message)
   res.send(error.message);
  }
  
});


app.listen(3000,()=>console.log('@http://localhost:3000'));