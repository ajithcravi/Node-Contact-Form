const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

//View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Mobile: ${req.body.mobile}</li>
  </ul>
  <h3>Message</h3>
<p>${req.body.message}</p>`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.aaainc.in",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "contactus@aaainc.in", // generated ethereal user
      pass: "AAAincgd4*" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"All About Architecture" <contactus@aaainc.in>', // sender address
    to: "craviajith@gmail.com", // list of receivers
    subject: "Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.render("contact", { msg: "Email has been sent" });
});

app.listen(3000, () => console.log("I am listening in port 3000"));
