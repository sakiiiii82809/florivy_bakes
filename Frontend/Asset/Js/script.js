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

// Feedback Form
const reviewList= document.getElementById("reviewsList");
const reviewForm= document.getElementById('submitReviewForm')
const reviewMessage= document.getElementById("reviewMessage");
const reviewerName= document.getElementById("reviewerName");
const reviewerEmail= document.getElementById("reviewerEmail");
const reviewComment= document.getElementById("reviewComment");
const submitButton= document.getElementById("submitBtn");


async function loadReviews() {
    if (!reviewList) {
        console.error("review was not found");
        return;
    }
    try {
        const response= await fetch("/api/comments");

        if(!response.ok) {
            throw new Error("Failed to load reviews");
        }

        const reviews = await response.json();

        reviewList.replaceChildren();
        reviewList.innerHTML= `<h3>What Our Customer Say</h3>`;

        if (!Array.isArray(reviews) || reviews.length === 0) {
             reviewList.innerHTML += `
                <p>Write your review here</p>
            `;
            return;
        }
        
        reviews.forEach(review => {
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");

            const name = document.createElement("h4");
            name.textContent = review.name || "Anonymous";

            const comment = document.createElement("p");
            comment.textContent = review.comment || "";

            reviewItem.appendChild(name);
            reviewItem.appendChild(comment);

            reviewList.appendChild(reviewItem);
        });

    } catch(error) {
        console.error("Error loading comments:", error);

        reviewList.innerHTML = `
            <h3>What Our Customers Say</h3>
            <p>Failed to load</p>
        `;
    }
}

if(reviewForm) {
    reviewForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    const name= reviewerName.value.trim();
    const email= reviewerEmail.value.trim();
    const comment= reviewComment.value.trim();

    if (!name || !comment) {
        reviewMessage.textContent= "Enter your name here";
        reviewMessage.className= "error message";
        return;
    }

    try {
        submitButton.disabled= true;
        submitButton.textContent= "Submitting...";

        const response= await fetch("/api/comments",{ 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            comment: comment
        })
        });
        
        const result = await response.json();

        if(!response.ok) {
            throw new Error(result.error ||"Couldn't save comment");
        }

        reviewMessage.textContent= "We appreciate your review!"; 
        reviewMessage.className= "successfully uploaded";
        
        reviewerName.value= "";
        reviewerEmail.value= "";
        reviewComment.value= "";

        await loadReviews();

    } catch(error) {
        console.error("Couldn't post comment", error);

        reviewMessage.textContent= error.message || "Something went wrong";

        reviewMessage.className = "error message";
    } finally {
        submitButton.disabled= false;
        submitButton.textContent= "Submit your thoughts";
    }
});
}

loadReviews();

