const express = require("express");
const evn = require("dotenv");
const { connectDB } = require("./connect/sequelize");
const cors = require("cors");
const { seedDb, seedAdmin } = require("../seed");
evn.config();

const userRoute = require("./routes/user.route");
const cinemaRoute = require("./routes/cinema.route");
const filmRoute = require("./routes/film.route");
const roomRoute = require("./routes/room.route");
const clusterRoute = require("./routes/cluster.route");
const bannerRoute = require("./routes/banner.route");
const booksRoute = require("./routes/book.route");
const playTimeRoute = require("./routes/playTime.route");
const discountRoute= require("./routes/discount.route")
const commentRoute= require("./routes/comment.route")
const nodemailer = require('nodemailer');
const { createassociation } = require("./models");

const app = express();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'datistpham@gmail.com',
    pass: 'husrccxljeocqbpi'
  }
});

console.log(process.env.PRIVATE_KEY_JWT);

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
connectDB();
createassociation();
app.get("/", (req, res) => {
  return res.json("oke");
});
app.use("/auth", userRoute);
app.use("/cinema", cinemaRoute);
app.use("/film", filmRoute);
app.use("/room", roomRoute);
app.use("/cluster", clusterRoute);
app.use("/banner", bannerRoute);
app.use("/book", booksRoute);
app.use("/playtime", playTimeRoute);
app.use("/discount", discountRoute)
app.use("/comment", commentRoute )

app.get("/seed", seedDb);
app.post("/seedAdmin", seedAdmin);
app.post("/mail", (req, res)=> {
  var mailOptions = {
    from: 'datistpham@gmail.com',
    to: req.body.email,
    subject: 'From netflix',
    html: `<div>
      <div>
      <strong>Film: ${req.body.film}</strong></div>
      <div>
        <strong>Cinema: ${req.body.cinema}</strong>
      </div>
      <div>
        <strong>Set: ${req.body.set}</strong>
      </div>
      <div>
        <strong>Seat: ${req.body.seat}</strong>
      </div>
      <br />
      <div>
        <div>Total grand:</div>
        <strong>${req.body.total} (Included VAT)</strong>
      </div>
    </div>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      return res.json("")
    } else {
      console.log('Email sent: ' + info.response);
      return res.json("")
    }
  });
})

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log("app listen on port " + port);
});
