console.log("first");
const submitButton=document.getElementById("submit");
const userName=document.getElementsByClassName("userName");
const email=document.getElementsByClassName("email");
const password=document.getElementsByClassName("password");
const ville=document.getElementsByName("ville");


submitButton.addEventListener("click", async ()=>{
    console.log(userName[0].value)
    console.log(email[0].value)
    console.log(password[0].value)
    for (let radio of value) {
        if (value.checked) {
            console.log(value)
        }
    }
    console.log("first")

    const rawResponse = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        body: JSON.stringify({
            username:userName[0].value, 
            email: email[0].value,
            password: password[0].value,
        })
    })

    const response = await rawResponse.json()
    
})

