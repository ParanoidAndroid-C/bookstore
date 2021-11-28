function showResults(){
    let query = document.getElementById("query").value;
    query = query.toLowerCase();
    if (query.startsWith('select')) {

        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
             console.log('here');
             console.log(this)
             console.log(this.responseText)
             //swindow.location.href = "../customreports";
            let results = JSON.parse(this.responseText);
            let num = document.createElement('h2');
            num.innerText = `Number of results: ${results.length}`
            document.body.appendChild(num)
            for (let i = 0; i < results.length; i++) {
                let num = document.createElement('h2');
                num.innerText = `----------------------`
                document.body.appendChild(num)
                let keys = Object.keys(results[i]);
                for (let key in  keys) {
                    key = keys[key]
                    let res = document.createElement('p');
                    let keyT = key == '?column?' ? 'result' : key;
                    res.innerText = `${keyT}: ${results[i][`${key}`]}`
                    document.body.appendChild(res)
                }

            }
            }  else if (this.readyState == 4 && this.status == 401) {
                alert("invalid query");
            } 
        }
        req.open("POST", "http://localhost:3000/customreports");
        req.setRequestHeader("Content-Type", "application/json");
        console.log(query)
        req.send(JSON.stringify({query: query}));  
    } else {
        alert("Query not supported");
    }
}