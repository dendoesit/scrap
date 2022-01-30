fetch("/data.json")
.then(response => {
   return response.json();
})
.then(jsondata => console.log(jsondata));


// d3.json("/data.json", function(data) {
//     console.log(data);
// });
