# micro-pdf

Node Micro-service to convert HTML into PDFs :page_facing_up:

Uses [Puppeteer](https://github.com/puppeteer/puppeteer) to render the page with a real chrome headless browser and prints it to PDF. Uses real chrome browser so what you see on your browser is what you get. This makes development much easier.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/vigzmv/micro-pdf)

## Server Side

Can be hosted on any provider with node runtime support.

```sh
npm install
npm run start
```

## Client Side

Make a post request with `{ html : `YOUR_HTML` }` and the response will be the PDF document

### Example:

```js
fetch("http://localhost:3000", {
  method: "POST",
  body: JSON.stringify({
    html: "<h1>Hello I am a PDF</h1>",
  }),
})
  .then((response) => response.blob())
  .then((blob) => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "example.pdf"; // You can set the name programmatically
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();
    a.remove(); //afterwards we remove the element
  });
```
