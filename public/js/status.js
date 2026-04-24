window.addEventListener("DOMContentLoaded", async () => {
    try {
        const orderId = window.location.pathname.split("/").pop();
        const token = localStorage.getItem("token");
        
        if (!token) {
            document.getElementById("status-title").textContent = "Error";
            document.getElementById("status-message").textContent = "You must be logged in to verify payments.";
            return;
        }

        const response = await axios.post("/payment/verify-payment", 
             { orderId },
             { headers: { "Authorization": token } }
        );

        if (response.data.success) {
            document.getElementById("status-title").textContent = "Payment Successful!";
            document.getElementById("status-message").textContent = response.data.message;
            document.getElementById("status-title").style.color = "green";
        } else {
            document.getElementById("status-title").textContent = "Payment Failed or Pending";
            document.getElementById("status-message").textContent = response.data.message;
            document.getElementById("status-title").style.color = "red";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("status-title").textContent = "Error Resolving Payment";
        document.getElementById("status-message").textContent = error.response ? (error.response.data.message || error.response.data) : error.message;
        document.getElementById("status-title").style.color = "red";
    } finally {
        document.getElementById("home-btn").style.display = "block";
    }
});
