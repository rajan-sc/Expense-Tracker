const cashfree = Cashfree({
    mode: "sandbox",
});

const btn = document.getElementById("renderBtn");
btn.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please login again.");
            return;
        }
        
        const response = await axios.post("/payment/create-payment-order", {},
            {
                headers: { "Authorization": token }
            }
        );
        
        console.log("Order Creation Response:", response.data);
        const paymentSessionId = response.data.paymentSessionId;
        
        if (!paymentSessionId) {
            throw new Error("Missing paymentSessionId from response");
        }
        
        let checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_self",
        };
        await cashfree.checkout(checkoutOptions);
    } catch (error) {
        console.error(error);
        alert(error.response ? error.response.data.message || error.response.data : error.message);
    }
});
