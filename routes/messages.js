var express = require('express');
var router = express.Router();
var Message = require('../models/message')


router.get('/', function(req,res,next){
  Message.find() //mongoose operation finds all messages
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

router.post('/', function (req, res, next) {
   var message = new Message({
     content: req.body.content
   })
  message.save(function(err,result) {
    if (err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      })
    }
    res.status(201).json({
      message: 'Saved Message',
      obj: result
    })
  })
});

router.patch('/:id', function(req,res,next)=>{
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

module.exports = router;