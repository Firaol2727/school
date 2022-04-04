const { verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { sequelize } = require('../models');
const departmentt=require('../models/department')
const router =require('express').Router();
// function addcourse(getcname,getdname){
//     let getdepartment,getcourse;
//     getdepartment=sequelize.models.Departments.findOne({
//         where:{dname:getdname}
//     })

// }

router.post('/register',(req,res)=>{
    let coursename =req.body.cname;
    let departmentname=req.body.dname;
    let department,course;
    sequelize.models.Department.sync({alter:true}).then(()=>{
        return sequelize.models.Department.findOne({
            attributes:['did'],
            where:{dname:departmentname}
        })

    }).then((data)=>{
        department=data.toJSON();
        console.log(department.did);
        res.send(department.did)
        // department=data;
        // sequelize.models.Course.findOne({
        // where
        // })
    }).catch((err)=>{
            console.log(err);
        })
        
        // .then((data)=>{
    //         // sequelize.models.Course.create({
    //         //     cname:coursename,
    //         //     DepartmentDid:data.did
    //         // })
    //         res.send(data.did);
    //     }).catch((err)=>{
    //     console.log(err);
    // console.log(getcourse);
   //res.send(getcourse)
})

router.post('/setcourse',async(req,res)=>{
    let getdepartment,getcourse;

    sequelize.models.Department.sync().then(()=>{
        let findDepartment= sequelize.models.Department.findOne({
            dname:req.body.dname
        });
        // res.send(req.body.dname)
        if(findDepartment){
            return sequelize.models.Department.findOne({
                where:{dname:req.body.dname} 
            
            })
        }
        else{
            res.send("not found")
            return sequelize.models.Department.create({
                dname:req.body.dname
            })
        }
        
    })
    .then((data)=>{
        getdepartment=data.toJSON();
        return sequelize.models.Course.create({
            cname:req.body.cname,
            DepartmentDid:getdepartment.did
        })
    }).then((data)=>{
        res.send(data.toJSON());
    })
    .catch((err)=>{
        console.log(err);
    })
    
})


router.post('/setstudent',async(req,res)=>{
    let getdepartment,getstudent;

    sequelize.models.Department.sync().then(()=>{
        let findDepartment= sequelize.models.Department.findOne({
            dname:req.body.dname
        });
        // res.send(req.body.dname)
        if(findDepartment){
            return sequelize.models.Department.findOne({
                where:{dname:req.body.dname} 
            
            })
        }
        else{
            res.send("not found")
            return sequelize.models.Department.create({
                dname:req.body.dname
            })
        }
        
    })
    .then((data)=>{
        getdepartment=data.toJSON();
        return sequelize.models.Student.create({
            sname:req.body.sname,
            year:req.body.year,
            DepartmentDid:getdepartment.did

        })
    }).then((data)=>{
        res.send(data.toJSON());
    })
    .catch((err)=>{
        console.log(err);
    })
    
})

router.get('/getcourse',async(req,res)=>{
    let getdepartment=req.body.dname;
    sequelize.models.Department.sync().then(()=>{
        return sequelize.models.Department.findOne({
            attributes:["dname"],
            where:{dname:'EarthScience'},
            include:[{
                model:db.Course,
                attributes:['cname']}
        
            ]
    }).then((data)=>{
        res.send(data.toJSON().Courses);
    })
    })
})

router.post('/student/login',(req,res)=>{
    let studentname=req.body.sname;
    let user="name";
    sequelize.models.Student.sync().then(async()=>{
        return  sequelize.models.Student.findOne({
            attributes:['sname'],
            where:{sname:'kebede'}
        }).then((data)=>{
            const user=data;
            jwt.sign({user},'secreteKey',(err,token)=>{
                res.json({
                    token,
                    user,
                })
            })


            // res.send(data);
            // User=data[0].toJSON();
            // if(User){
            //     // jsonwebtoken.sign({user:User},'secreteKey',(err,token)=>{
            //     //     res.send.json({
            //     //         token,
            //     //     })
            //     // })
            // }
            // else{
            //     res.send("something went wrong ")
            // }
        })
       
    })
    
    
    // if(findstudent){
    //     jsonwebtoken.sign({user:User})

    // }
    // else{
    //     res.send(" There is no user with this id ")
    // }

})


router.get('/student/login/required',verifylogin,(req,res)=>{
        jwt.verify(req.token,'secreteKey' ,function (err,data){
            if(err){
                res.sendStatus(403);
            }
            else{
                res.json({
                    msg:"This is accessed by the token ",
                    data,
                })
            }
        })
        
    
    
    })

function verifylogin(req,res,next){
    const bearerHeader=req.headers["authorization"];
    if(typeof bearerHeader!=='undefined'){
        const bearer=bearerHeader.split(" ");
        const bearerToken=bearer[1];
        req.token=bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

module.exports=router;
