const express =require( 'express')
const router = express.Router();
const userCtrl =require( '../controllers/user.controller')
const authCtrl =require( '../controllers/auth.controller')
const User = require("../models/user.model");
const Event = require("../models/event.model");
require('dotenv').config();
const nodemailer = require('nodemailer');
const Rule = require("../models/rule.model");
const Restriction= require("../models/restriction.model");
const Group = require("../models/group.model");
const PageViews = require("../models/pageviews.model");

const jwt =require( 'jsonwebtoken')
const expressJwt =require( 'express-jwt')
const config =require( './../config/config')
var random = require('mongoose-simple-random');

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

router.put("/addtopagecounter/:page", (req, res, next) => {
  console.log(req.body,"body")
  let visitorinfo=req.body.user
  console.log(visitorinfo,"visitorinfo")
  if (req.params.page==="info"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'info' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="home"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'home' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="humanistunion"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'humanistunion' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="kerala"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'kerala' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="youtube"){
    console.log("updating youtube")
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'youtube' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="jamahiriya"){
    console.log("updating youtube")
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'jamahiriya' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="ujamaa"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'ujamaa' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="spain"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'spain' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="democracy"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'democracy' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
  if (req.params.page==="neatugua"){
    PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'neatugua' : visitorinfo}})
    .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }
          })
  }
if (req.params.page==="psychologicalwar"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'psychologicalwar' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
if (req.params.page==="tennomar"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'tennomar' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
if (req.params.page==="paris"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'paris' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
if (req.params.page==="cooperatives"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'cooperatives' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}

if (req.params.page==="cooperativesvideos"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'cooperativesvideos' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
if (req.params.page==="libertariansocialismvideos"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'libertariansocialismvideos' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
if (req.params.page==="democracyvideos"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'democracyvideos' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
if (req.params.page==="manufacturingconsentvideos"){
  PageViews.findOneAndUpdate({name:"pageviews"},{$addToSet : {'manufacturingconsentvideos' : visitorinfo}})
  .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
}
})

router.post("/getpasswordresettoken/:email", (req, res) => {
console.log(req.params.email)
  const token = jwt.sign({
    email: req.params.email
  }, config.jwtSecret
, {expiresIn: "1h"})
console.log("token",token)
  return res.json({
    token:token
  })
})
router.post("/verifychangepasswordjwt/:token/:email", (req, res) => {
console.log(req.params.email)
jwt.verify(req.params.token, config.jwtSecret, (err,decoded) => {
              if(err){
                res.status(400).json(err)
              } else {
                if(decoded.email.toLowerCase()==req.params.email.toLowerCase()){
                  res.status(200).json("can log in")
              }else{
                res.status(400).json('Error: emails do not match')
              }              }
          })
})

router.get("/getusers", (req, res) => {
  User.find({"active":true})
  .populate("restrictions")
  .populate("groupstheybelongto")
  .populate("recentprivatemessages")
  .then(rule => res.json(rule))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.get("/finduser/:userId", (req, res) => {
  User.find({_id:req.params.userId})
  .populate("restrictions")
  .populate("groupstheybelongto")
  .populate("highergroupstheybelongto")
  .exec(function(err,docs){
    if(err){
      console.error(err);
    }else{
      res.status(200).json({
        data: docs
      })}
    })})


    router.get("/findgroup/:groupId", (req, res, next) => {
      const items=Group.find({_id:req.params.groupId})
      .populate({path: 'members'})
      .populate('groupabove')
      .populate('groupsbelow')
      .populate({
  path: 'groupsbelow',
  populate: {
    path: 'groupsbelow',
    populate:{path:'members'}
  },
  populate: {
    path: 'members',
  }
}).exec(function(err,docs){
        if(err){
          console.error(err);
        }else{
          res.status(200).json({
            data: docs
          });
        }
      })
    })

      router.get("/findgroupscoordinates", (req, res, next) => {
        const items=Group.find({}, { _id: 1, centroid: 1 })
        .exec(function(err,docs){
          if(err){
            console.error(err);
          }else{
            res.status(200).json({
              data: docs
            });
          }
        })
      })


        router.put("/addleaders/:groupId/:oldleaders/:newleaders", (req, res, next) => {
          let oldleaders=req.params.oldleaders.split(',')
          let newleaders=req.params.newleaders.split(',')
          console.log(oldleaders)
          console.log(newleaders)

          Group.findByIdAndUpdate(req.params.groupId, {$pull : {
            members:oldleaders
          }}).exec()
          Group.findByIdAndUpdate(req.params.groupId, {$addToSet : {
            members:newleaders
          }}).exec()
        })


        router.route('/join/:groupId/:userId').put((req, res) => {
          let userId = req.params.userId;
          let groupId = req.params.groupId;

          User.findByIdAndUpdate(userId, {$addToSet : {
            groupstheybelongto:groupId
          }}).exec()
          Group.findByIdAndUpdate(groupId, {$addToSet : {
            members:userId
          }}).exec()
        })

        router.route('/leave/:groupId/:userId').put((req, res) => {
          let userId = req.params.userId;
          let groupId = req.params.groupId;

          User.findByIdAndUpdate(userId, {$pull : {
            groupstheybelongto:groupId
          }}).exec(function(err,docs){
                if(err){
                  console.error(err);
                }else{
                  console.log(docs)
                }
              })
          Group.findByIdAndUpdate(groupId, {$pull : {
            members:userId
          }}).exec(function(err,docs){
                if(err){
                  console.error(err);
                }else{
                  res.status(200).json({
                    data: docs
                  });
                }
              })
        })

        router.route('/addlowertohigher/:lowerGroupId/:higherGroupId').put((req, res) => {
          console.log("ADDING LOWER GROUP TO HIGHER",req.params.lowerGroupId,req.params.higherGroupId)
          Group.findByIdAndUpdate(req.params.higherGroupId, {$addToSet : {
            groupsbelow:req.params.lowerGroupId
          }}).exec(function(err,docs){
                if(err){
                  console.error(err);
                }else{
                  res.status(200).json({
                    data: docs
                  });
                }
              })
        })


        router.get("/findgroups/:cool", (req, res, next) => {
          const items=Group.find({cool:req.params.cool}
)
          .populate('members')
          .exec(function(err,docs){
            if(err){
              console.error(err);
            }else{
              res.status(200).json({
                data: docs
              });
            }

          })})

          router.post("/creategroup", (req, res, next) => {
            console.log(req.body)
            let newGroup = new Group({
              _id: req.body['_id'],
              level:req.body['level'],
              images:req.body['images'],
              cool:req.body['cool'],
              groupabove:req.body['groupabove'],
              timecreated:req.body['timecreated'],
              members:req.body["members"],
              allmembers:req.body["members"],
              title:req.body['title'],
              description:req.body['description'],
            });

            newGroup.save((err) => {
              if(err){
                res.status(400).json({
                  message: "The Item was not saved",
                  errorMessage : err.message
                })
              }else{
                res.status(201).json({
                  message: "Item was saved successfully",
                  data:newGroup._id
                })
              }
            })
          })


          router.delete("/deleterestriction", (req, res, next) => {
            console.log("DELETEING RESTRICTION",req.body)
            Restriction.findOneAndDelete({ $and: [{ usertorestrict: req.body.usertorestrict._id },
             { restriction: req.body.restriction }, { duration: req.body.duration }] },)
            .exec(function(err,docs){
              if(err){
                      console.error(err);
                  }else{
                    console.log("docs",docs)
                      res.status(200).json({
                                  data: docs
                              });
            }
          })
          })

          router.put("/removerestrictionfromuser/:restId/:userId", (req, res, next) => {
            console.log("DELETEING RESTRICTION",req.params)
            User.findByIdAndUpdate(req.params.userId,{$pull : {
              restrictions:req.params.restId
            }})
            .populate('restrictions')
            .exec(function(err,docs){
              if(err){
                      console.error(err);
                  }else{
                    console.log("docs",docs)
                      res.status(200).json({
                                  data: docs
                              });
            }
          })
          })

          router.post("/createuserrrestriction", (req, res) => {
            const restriction = new Restriction(req.body);
            console.log("restriction",restriction)
            restriction.save((err, doc) => {
              if (err) return res.json({ success: false, err });
              return res.status(200).json({
                success: true,
                data:doc
              });
            });
          });

          router.put("/addrestrictiontouser/:user/:restriction", (req, res, next) => {
            console.log("adding restriction to user",req.params.user,req.params.restriction)
            User.findByIdAndUpdate(req.params.user, {$addToSet : {
              restrictions:req.params.restriction
            }})
            .populate('restrictions')
            .exec(function(err,docs){
              if(err){
                console.error(err);
              }else{

                res.status(200).json({
                  data:docs,
                  message: "User updated successfully"
                })
              }
            })
          })


          router.put("/removerestrictionfromuser/:user/:restriction", (req, res, next) => {
            console.log("removing restriction from user",req.params.user,req.params.restriction)
            User.findByIdAndUpdate(req.params.user, {$pull : {
              restrictions:req.params.restriction
            }}).exec(function(err,docs){
              if(err){
                console.error(err);
              }else{

                res.status(200).json({
                  data:docs,
                  message: "User updated successfully"
                })
              }
            })
          })

          router.get("/findreviews/:groupId/:userId", (req, res, next) => {
            console.log("ids in server",req.params.userId)

            const items=Review.find({groupId:req.params.groupId, userId:req.params.userId})
            .exec(function(err,docs){
              if(err){
                console.error(err);
              }else{
                res.status(200).json({
                  data: docs
                });
              }

            })})


            router.post('/sendemailnotification', (req, res, next) => {
              console.log("send email notfication",req.body.message,req.body.emails)

              if(req.body.emails.length>0){
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                  }
                })
                const optionsArray=req.body.emails.map(email=>{
                  const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: req.body.subject,
                    text: `${req.body.message}. Don't forget to invite your friends and family to try
                    the Democratic Social Network. Email them a link https://democratic-social-network.herokuapp.com`
                  };
                  return mailOptions
                })

                optionsArray.forEach(sendEmails)

                function sendEmails(item){
                  transporter.sendMail(item, function(error, info){
                    if (error) {
                      console.error(error);
                    } else {
                      console.log('Email sent: ' + info.response)
                    }
                  })

                }
              }
            })


              router.get("/finduserrestrictions/:userId", (req, res, next) => {
                const items=User.findById(req.params.userId)
                .populate('restrictions')
                .exec(function(err,docs){
                  if(err){
                    console.error(err);
                  }else{
                    res.status(200).json({
                      data: docs
                    });
                  }
                })})





                router.get("/getuser/:userId", (req, res, next) => {
                  var userId=req.params.userId
                  console.log("userId in router",userId)
                  const items=User.findById(userId)
                  .populate("recentprivatemessages")
                  .populate({path:"restrictions",
                                populate: {
                                  path: 'usertorestrict'}})
                  .exec(function(err,docs){
                    if(err){
                      console.error(err);
                    }else{
                      res.status(200).json({
                        data:docs,
                        message: "fetching user"
                      })
                    }
                  })
                })





                router.post("/createuser", (req, res, next) => {
                  var user=req.body.user
                  let newUser = new User(user);

                  console.log("new user in server",newUser)
                  newUser.save((err,docs) => {
                    if(err){
                      console.error(err)
                      res.status(400).json({
                        message: "The Item was not saved",
                        errorMessage : err.message
                      })
                    }else{
                      console.log("DOCS",docs)
                      res.status(201).json({
                        message: "Item was saved successfully",
                        data:docs
                      })
                    }
                  })

                })

                router.put("/updateuser/:user", (req, res, next) => {
                  User.findByIdAndUpdate(req.params.user, req.body).exec(function(err,docs){
                    if(err){
                      console.error(err);
                    }else{

                      res.status(200).json({
                        data:docs,
                        message: "User updated successfully"
                      })
                    }
                  })
                })



                module.exports= router
