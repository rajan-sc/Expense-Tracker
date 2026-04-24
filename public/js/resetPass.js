const resetPassForm = document.getElementById("reset-password-form");

resetPassForm.addEventListener("submit", resetPassword);

async function resetPassword(e){
    try{
        e.preventDefault();
        console.log(resetPassForm);
        const password = document.getElementById("password").value;
        const uuid = window.location.pathname.split("/")[3];
        const response = await axios.post(`/password/reset-password/${uuid}`, {password});
        document.getElementById("error-msg").textContent = response.data.message;
        window.location.href = "/login";
    }catch(error){
        console.log(error);
        document.getElementById("error-msg").textContent = error.response.data.message;
    }
}



