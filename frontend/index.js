// Hamburger Menu Toggle (your existing code)
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


// ✅ Contact Form Microservice Integration
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      alert(result.message);

      // ✅ Clear form after submission
      form.reset();

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Make sure backend is running.");
    }
  });
}
