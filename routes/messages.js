var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Message = require('../models/message');


router.get('/', function(req,res,next){
  Message.find() //mongoose operation finds all messages
         .populate('user', 'firstName')  //mongoose method that allows me to expand data i'm retrieving, pass in user model as string , second param is data we want to access
  .exec(function(err, messages){
    if (err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      })
    }
    res.status(200).json({
      message: 'Success',
      obj: messages
    })
  });  
});

//check if user is logged in and has valid token
router.use('/', function(req, res, next){
  jwt.verify(req.query.token, 'secret', (err, decoded)=>{
if(err){
  return res.status(401).json({
    title: 'Not Authenticated',
    error: err
  })
}
next()
  })
});

router.post('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token); //decrpyt token to link user to messages
  User.findById(decoded.user._id, function(err, user){
    if(err){
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      })
    }
    var message = new Message({
       content: req.body.content,
       user: user._id
     })
    message.save(function(err,result) {
      if (err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        })
      }
      user.messages.push(result);
      
      res.status(201).json({
        message: 'Saved Message',
        obj: result
      })
      user.save();
    })
  })
});

router.patch('/:id', function(req,res,next){
  var decoded = jwt.decode(req.query.token);
  Message.findById(req.params.id, function(err, message) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      })
    }
    if(!message){
      return res.status(500).json({
        title: 'no message found',
        error: {message: "Message not found"}
      })
      }

    if (message.user != decoded.user_id){
      return res.status(401).json({
        title: 'Not Authenticated',
        error: {message: 'users do not match'}
      });
    }
      message.content = req.body.content;
      message.save(function(err, result){
        if (err){
          return res.status(500).json({
            title: 'An error occured',
            error: err
          })
        }
        res.status(200).json({
          message: 'Updated Message',
          obj: result
        })
      })
  })
})

router.delete('/:id', function(req,res,next){
  var decoded = jwt.decode(req.query.token);
  Message.findById(req.params.id, function(err, message) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      })
    }
    if(!message){
      return res.status(500).json({
        title: 'no message found',
        error: {message: "Message not found"}
       })
      }
    if (message.user != decoded.user_id){
        return res.status(401).json({
          title: 'Not Authenticated',
          error: {message:'users do not match'}
        });
      }
      message.remove(function(err, result){
        if (err){
          return res.status(500).json({
            title: 'An error occured',
            error: err
          })
        }
        res.status(200).json({
          message: 'Deleted Message',
          obj: result
        })
      })
  })
})
module.exports = router;