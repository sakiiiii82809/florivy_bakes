// Database
const express= require("express");
const fs= require("fs");
const path= require("path");

const app= express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Html/index.html"));
});
const FILE= path.join(__dirname, "comments.json");

// This determines if the .json exists to be able to use as a database
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
}

/* This essentially retrieve the submitted data to become a comment in the feedback form
   and executes a catch block when a comment failed to get retrieved
*/
app.get("/api/comments", (req, res) => {
    try {
        const data= fs.readFileSync(FILE, "utf-8");
        const comments= JSON.parse(data);
        res.json(comments);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Cannot read comments, please write another one."});
    }
});

/*Then, this block of code checks for errors and when theres no exceptions, it allows the
  comment to be posted in the feedback form
*/
app.post("/api/comments", (req, res) => {
    try {
        const comment= req.body.comment?.trim();
        if(!comment) {
            return res.status(400).json({
                error: "Comments cannot be empty, please write again."
            })
        }
        const data= fs.readFileSync(FILE, "utf-8");
        const comments= JSON.parse(data);
        const newComment= {
            id: Date.now(),
            comment: comment
        };
        comments.push(newComment);
        fs.writeFileSync (
            FILE,
            JSON.stringify(comments, null, 2)
        );
        res.json(newComment);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save the comment."});
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});