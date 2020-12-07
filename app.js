const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const port = process.env.PORT || 3000;

const app = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write('<html><body>'
            + '<h1>Code Test read and write </h1>'
            + '<h1><a href = "http://localhost:3000/read"> Read</a> </h1> <br>'
            + '<h1> <a href = "http://localhost:3000/writecontent"> Write</a> </h1>'
            + '</body></html>'
        );
        res.end();
    }
    else if (req.url === "/writecontent") {
        res.writeHead(200, { "Content-Type": "text/html" });
        const form = '<html><body>'
            + '<h1>Code Test read and write </h1>'
            + '<form method="post" action="write" enctype="application/x-www-form-urlencoded"><fieldset>'
            + '<div><label for="content">File content:</label><textarea name="content" id="content" rows="4" cols="50" placeholder="write the content of your file here"> </textarea> </div>'
            + '<div><input id="ListCommits" type="submit" value="List Commits" /></div></fieldset></form></body></html>'

        res.end(form)
    }
    else if (req.url === "/read") {
        fs.readFile("myfile.txt", (err, data) => {
            if (err) {
                if (err.code === "ENOENT") {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.write("This file does not exist");
                    return res.end();
                }
                console.log(err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            }
        });
    } else if (req.method === "POST") {
        if (req.url === "/write") {
            // let bufferToString = "";
            req.on("data", (data) => {
                let bufferToString = data.toString()
                let formData = qs.parse(bufferToString)

                fs.appendFileSync(`myfile.txt`, formData.content, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.write("Content was successfully written to the file");
                        res.end();
                    };
                });
            });
            res.end('<html><body>'
                + '<h1> Thank you, file successfully created</h1>'
                + '</html><body>'
            );

        }
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("Resource not Found");
        res.end();
    }
});

app.listen(port);
console.log("app server created");
