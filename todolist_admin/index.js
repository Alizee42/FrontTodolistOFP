const list = document.getElementById("urgent");

async function getTasks(){
    const rawResponse = await fetch('http://localhost:3000/getTasks')
    const response = await rawResponse.json()
    console.log(response)
}

getTasks();