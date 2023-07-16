const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");


const app = express();
// var items = ["Buy Food", "Cook Food", "Eat Food"];

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// let day = date.getDate();

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

var items = [];
app.get("/", async(req, res) => {
  try {
    items = await Item.find({});


    if(items.length === 0) {
      Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newItemList: items
      });
    }
    // console.log(items);
  } catch(err) {
    console.log("err", + err);
  }
  

});

app.post("/", async(req, res) => {

  const itemName = req.body.newItem;
  const listName = req.body.button;

  const item = new Item ({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    var foundList = await List.findOne({name: listName});
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  }
})

app.post("/delete", async(req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today") {
    await Item.findByIdAndRemove(checkedItemId);
    res.redirect("/");
  } else {
    await List.findOneAndUpdate(
      {name: listName}, 
      {$pull: {items: {_id: checkedItemId}}}
    );
  }
});


app.get("/about", async(req,res) => {
  res.render("about");
})

app.get("/:customListName", async(req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  const customList = await List.findOne({name: customListName});

  if(!customList) {
    const list = new List({
      name: customListName,
      items: defaultItems
    });

    list.save();
    res.redirect("/" + customListName);

  } else {
    res.render("list", {
      listTitle: customList.name,
      newItemList: customList.items
    });
  }
  
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
})

