var mongoose=require("mongoose");

var blogSchema= new mongoose.Schema({
    title:String,
    image:{type:String, default:"placeholder image.jpeg"},
    body:String,
    created:{type:Date, default:Date.now},
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"//name of hte model
    }]
});

module.exports= mongoose.model("Blog",blogSchema);