const forgotPasswordForm = document.getElementById("forgot-password-form");
const errorMsg = document.getElementById("error-msg");


forgotPasswordForm.addEventListener("submit", forgotPassword);
const submitBtn = document.getElementById("forgot-password-btn");

async function forgotPassword(e) {
    try {
        if(submitBtn){
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }
        e.preventDefault();
        const email = document.getElementById("email").value;
        const response = await axios.post("/password/forgot-password", {email});
        errorMsg.textContent = response.data.message;
    }
    catch(error){
        console.log(error);
        errorMsg.textContent = error.response.data.message;
    }finally{
        if(submitBtn){
            submitBtn.disabled = false;
            submitBtn.textContent = "Forgot Password";
        }
    }
};

