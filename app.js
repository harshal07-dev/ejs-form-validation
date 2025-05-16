import express from "express";
import ejs from "ejs";
import dotenv from "dotenv";
import colors from "colors";
import { fileURLToPath } from "url";
import path from "path";
import { body, validationResult } from "express-validator";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// routing
app.get("/", (req, res) => {
  res.render("index", { errors: [], oldInput: {} });
});

app.post(
  "/submit",
  [
    body("username").notEmpty().withMessage("please enter the username"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be atleast 6 characters"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("passwords do not match"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index", {
        errors: errors.array(),
        oldInput: req.body,
      });
    }
    res.render("success", { user: req.body });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}`.yellow.underline.bold)
);
