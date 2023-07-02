const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
var items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  
  let day = date.getDate();

  res.render("list", {
    listTitle: day,
    newItemList: items
  });

});

app.post("/", (req, res) => {

  if (req.body.button === "Work") {
    workItems.push(req.body.newItem);
    res.redirect("/work");
  } else {
    items.push(req.body.newItem);
    res.redirect("/");
  }


})

app.get("/work", function(req,res){
  res.render("list", {
    listTitle: "Work List", 
    newItemList: workItems
  });
});

app.get("/about", (req,res) => {
  res.render("about");
})
app.listen(3000, () => {
  console.log("Server started on port 3000");
})

