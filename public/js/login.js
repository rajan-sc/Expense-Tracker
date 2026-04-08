const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

loginForm.addEventListener("submit", login);

async function login(e) {
try
    {
    e.preventDefault();
    errorMsg.textContent = "";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await axios.post("http://localhost:3000/user/login", {email, password});
    console.log(response.data);
    localStorage.setItem('token', response.data.token);
    alert("Login successful");
    window.location.href = "/expense";
    }
catch(error){
    console.log(error);
    if(error.response){
        if(error.response.status === 404){
            errorMsg.textContent = error.response.data.message;
        }
        else if(error.response.status === 401){
            errorMsg.textContent = error.response.data.message;
        }
        else{
            errorMsg.textContent = "Something went wrong. Please try again later.";
        }
    }
    else{
        errorMsg.textContent = "Network error";
    }
}
}

