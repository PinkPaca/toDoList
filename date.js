
exports.getDate = () => {
  console.log(module);

  var today = new Date();
  
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  

  return today.toLocaleDateString("en-US", options);
}

