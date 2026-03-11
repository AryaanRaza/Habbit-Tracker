
    //Add new Element
    function newElement() {
         let li = document.createElement("li");
         let inputValue = document.getElementById("myInput").value;
         let t = document.createTextNode(inputValue);
         li.appendChild(t);
         if(inputValue === '') {alert("You must write something");
         }
        else{document.getElementById("myUL").appendChild(li);
         }
        document.getElementById("myInput").value ="";

        
   
    }
     document.getElementById("myInput").addEventListener("keypress",function(event){
        if(event.key === "Enter"){
            newElement();
        }
    });    


