<<<<<<< HEAD
const backToTop = document.querySelector(".backtotop-btn");
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
=======
// Frontpage feedback form
const form= document.getElementById("feedbackForm");
const commentInput= document.getElementById("comment");
const commentPost= document.querySelector(".comments");

async function loadComments() {
    try {
        const response= await fetch("api/comments");

        if(!response.ok) {
            throw new Error("Failed to load comments");
        }

        const comments = await response.json();

        commentPost.innerHTML= "";

        if (comments.length == 0) {
            commentPost.innerHTML= "<p>Customer reviews will appear here.</p>";
            return;
        }
        
        comments.forEach(item => {
            const p= document.createElement("p");
                p.textContent = item.comment;
                commentPost.appendChild(p);
        });
    } catch(error) {
        console.error("Error loading comments", error);
    }
}

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    const comment= commentInput.value.trim();
    if (!comment) return;

    try {
        const response= await fetch("api/comments",{ 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment: comment
        })
        });
        
        if(!response.ok) {
            throw new Error("Couldn't save comment");
        }

        commentInput.value= "";

        loadComments();
    } catch(error) {
        console.error("Couldn't post comment", error);
    }
});

loadComments();
>>>>>>> 1d1b788aa8d252d4afbc6d90345d782b060284b4
