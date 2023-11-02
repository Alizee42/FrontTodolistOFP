console.log("first");
const submitButton=document.getElementById("submit");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const ville = document.getElementsByName("ville");


submitButton.addEventListener("click", async ()=>{
    console.log(userName.value)
    console.log(email.value)
    console.log(password.value)
    console.log("first")
    

    let region;
    for (var i = 0; i < ville.length; i++) {
        if (ville[i].checked) {
            region = ville[i].value;
            console.log(region)
        }
    }

    const data = {
        username: username.value,
        email: email.value,
        password: password.value,
        region: region,
    }

    try {
        const rawResponse =  await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams(data)
        })

        const response = await rawResponse.json();
    } catch (error) {
        console.log(error)
    }
    
})

