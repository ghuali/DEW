var trafficLight= prompt ("What colour is the traffic Light? ");
if ( trafficLight == "red"){
  document.write ("<div>") ;
  document.write ("<h1>") ;
  document.write ("Trafic Light is red") ;
  document.write ("</h1>") ;
  document.write ("</div>") ;
  console.log (trafficLight);
} else if ( trafficLight == "green")
  { document.write ("<div>") ;
  document.write ("<h1>") ;
  document.write ("Trafic Light is green") ;
  document.write ("</h1>") ;
  document.write ("</div>") ;
  console.log (trafficLight);
  } else {document.write ("<div>") ;
  document.write ("<h1>") ;
  document.write ("Trafic Light must be orange") ;
  document.write ("</h1>") ;
  document.write ("</div>") ;
  console.log (trafficLight);}
// compparison operators < > >= <= == === != !==
// logical operators && || 

var carNumber = prompt ("How many cars are there?");

while ( carNumber > 0 ){
  
  document.write ("CAR");
  carNumber--;
  
}
document.write ("<br>");
var shopNumber = prompt ("How many shops are there?");

for (n =0; n < shopNumber; n++ ){
  document.write ("SHOP");
  
}
               
/* inside the loop we can use an if statement combined with continue (skip this iteration) or break (get out of the loop)*/