const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const port = process.env.PORT || 3000;

const app = http.createServer((req, res) => {
    // home page
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write('<html><body>'
            + '<h1>Code Test read and write </h1>'
            + '<h1><a href = "/read"> Read</a> </h1> <br>'
            + '<h1> <a href = "/writecontent"> Write</a> </h1>'
            + '</body></html>'
        );
        res.end();
    }
    // endpoint to show form to write file content
    else if (req.url === "/writecontent") {
        res.writeHead(200, { "Content-Type": "text/html" });
        const form = '<html><body>'
            + '<h1>Code Test read and write </h1>'
            + '<form method="post" action="write" enctype="application/x-www-form-urlencoded"><fieldset>'
            + '<div><label for="content">File content:</label><textarea name="content" id="content" rows="4" cols="50" placeholder="write the content of your file here"> </textarea> </div>'
            + '<div><input id="submit" type="submit" value="Submit" /></div></fieldset></form></body></html>'

        res.end(form)
    }
    // endpoint to read file 
    else if (req.url === "/read") {
        fs.readFile("myfile.txt", (err, data) => {
            if (err) {
                // checks if file exist
                if (err.code === "ENOENT") {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.write("This file does not exist");
                    return res.end();
                }
                console.log(err);
            } else {
                // write file content to screen
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            }
        });
    } else if (req.method === "POST") {
        // endpoint to submit form and write the file 
        if (req.url === "/write") {
            req.on("data", (data) => {
                // convert the data of type buffer to string 
                let bufferToString = data.toString()
                // get the data to be able to get only the content
                let formData = qs.parse(bufferToString)
                // create file by append the content to it, if it exist add new content to it
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
                + '<h1><a href = "/read"> Read File</a> </h1> <br>'
                + '<h1><a href = "/open"> open File</a> </h1> <br>'
                + '</html><body>'
            );

        }

    }
    // endpoint to open the file on the browser 
    else if (req.url === '/open') {
        fs.open("myfile.txt", 'r', (err, file) => {
            if (err) {
                console.log(err)
                res.end('<html><body>'
                    + '<h1> An error occured while trying to open the file</h1>'
                    + '</html><body>')
            }
            console.log("file opened")
            const buff = Buffer.alloc(1024);
            fs.read(file, buff, 0, buff.length, 0, (err, bytes) => {
                if (err) throw err;
                if (bytes > 0) {
                    res.write(buff.slice(0, bytes).toString())
                    res.end();
                }
            })
        })
    }
    // handles an endpoint that doesnt exist
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(
            '<html><body>'
            + '<h1> Page not Found</h1>'
            + '</html><body>'
        );
    }
});

app.listen(port);
console.log("app server created");
