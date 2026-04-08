const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", signup);

async function signup(e) {
    e.preventDefault(); // stop page refresh

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await axios.post("/user/signup", { name, email, password });
        console.log(res.data);
        localStorage.setItem('token', res.data.token);
        alert("User created successfully");
        window.location.href = "/expense";
    } catch (error) {
        console.log(error);
        alert("User already exists!")
    }
}
