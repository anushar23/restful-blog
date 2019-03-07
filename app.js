var bodyParser=require("body-parser"),
methodOverride=require("method-override"),
sanitizer=require("express-sanitizer"),
mongoose=require("mongoose"),
express=require("express"),
app=express();

//APP CONFIG
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/restful-blog-app", { useNewUrlParser: true });
app.use(express.static("public"));//so as to look for css files in folder named public instead of the default views folder
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());//to prevent entry of scripts in html allowed input done via <%- 
app.use(methodOverride("_method"));


//MONGOOSE MODEL CONFIG
var Blog=require("./models/blogs"),
Comment=require("./models/comments");

// Blog.create({
    
//     title:"Test blog",
//     image:"https://images.unsplash.com/photo-1465046099577-a121a6ab11b6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=be46381dbfbe51e3b09ae7625f519af8&auto=format&fit=crop&w=500&q=60",
//     body: "First blog post"
// });

//RESTFUL ROUTES
app.get("/",function(req, res) {
    res.redirect("/blogs");
});


app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
         res.render("index",{blogs:blogs}); 
        }
    });
  
});

//RANDOM DOG PIC API PAGE
app.get("/cheer", function(req,res){
   
    
    res.render("cheer");
  
    

 
})

//NEW ROUTE
app.get("/blogs/new",function(req, res) {
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
   req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
           
            res.render("new");
                }
        else{
            res.redirect("/blogs");
        }
    });
    
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    // var id=req.params.id;
    Blog.findById(req.params.id).populate("comments").exec(function(err,blogForId){
        if(err){
            
                res.redirect("/blogs");
           
                }
        else{
             res.render("show",{blog:blogForId});
        }
        
    });
   
});

//==================
//COMMENT ROUTES-nested routes
//================

//NEW route
app.get("/blogs/:id/comments/new",function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog) {
        if(err){
            console.log(err)
        }
        else{
            res.render("new_comment",{blog:foundBlog});
        }
    })
})

app.post("/blogs/:id/comments",function(req,res){
        
        Blog.findById(req.params.id,function(err,found){
            if(err){
                console.log(err)
            }
            else{
                Comment.create(req.body.comment,function(err,created){
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        found.comments.push(created)
                        found.save()
                        res.redirect("/blogs/"+req.params.id)
                    }
                })
            }
        })
    
})



//============
//END OF COMMENT ROUTES
//===============


//EDIT ROUTES
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
                res.render("edit",{blog:foundBlog});

        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
       req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })

})

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
              res.redirect("/blogs");
        }
    });
    
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("blog app server has started");
});
