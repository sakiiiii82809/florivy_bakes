// Database
const express= require("express");
const fs= require("fs");
const path= require("path");

const app= express();   

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));
const FILE= path.join(__dirname, "reviews.json");

// This determines if the .json exists to be able to use as a database
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
}

/* This essentially retrieve the submitted data to become a comment in the feedback form
   and executes a catch block when a comment failed to get retrieved
*/
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../Frontend/Html/index.html")
    );
});

app.get("/api/comments", (req, res) => {
    try {
        const data = fs.readFileSync(FILE, "utf8");
        const reviews = JSON.parse(data);

        res.json(reviews);
    } catch (error) {
        console.error("Error loading reviews:", error);
        res.status(500).json({
            error: "Failed to load reviews."
        });
    }
});

/*Then, this block of code checks for errors and when theres no exceptions, it allows the
  comment to be posted in the feedback form
*/
app.post("/api/comments", (req, res) => {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim();
        const comment = req.body.comment?.trim();

        if (!name) {
            return res.status(400).json({
                error: "Please enter your name."
            });
        }

        if (!comment) {
            return res.status(400).json({
                error: "Please enter your comment."
            });
        }

        const data = fs.readFileSync(FILE, "utf8");
        const reviews = JSON.parse(data);

        const newReview = {
            id: Date.now(),
            name: name,
            email: email || "",
            comment: comment
        };

        reviews.push(newReview);

        fs.writeFileSync(
            FILE,
            JSON.stringify(reviews, null, 2)
        );

        res.status(201).json(newReview);

    } catch (error) {
        console.error("Error saving review:", error);

        res.status(500).json({
            error: "Failed to save review."
        });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});