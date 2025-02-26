const express = require("express");
const app = express();
const { Sport, User, Sessions, playerSessions } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("tiny-csrf"); 
const { Op } = require("sequelize"); 
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy; 
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser("shh! some secret string")); 
app.use(session({
    secret: "my-super-secret-key-21728172615261563",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(csrf("12345678901234567890123456789012", ["POST", "PUT", "DELETE"])); 

app.use((request, response, next) => {
  response.locals.messages = request.flash();
  next();
});

// ✅ Fixed Passport Local Strategy
passport.use(new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          return done(null, false, { message: "Your account doesn't exist, try signing up" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
));

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => done(null, user))
    .catch((error) => done(error, null));
});


// routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Sports Scheduler' });
});


app.get("/", async (request, response) => {if (request.user) {
    return response.redirect("/sport");
  }
  return response.render("index", {
    csrfToken: request.csrfToken(),
  });
});

app.get("/sport",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(request.user);
    const loggedInUserRole = request.user.role;
    console.log(loggedInUserRole);

    try {
      const allSports = await Sport.getSports();
      const playSessions = await playerSessions.getSessions(request.user.id);
      const sessionIDs = playSessions.map((v) => v.session_id);
      const UserSessions = await Sessions.UserSessions(sessionIDs);
      console.log(UserSessions);
      const allUpcoming = await Sessions.UpSessions(UserSessions);
      if (request.accepts("html")) {
        response.render("sports", {
          allSports,
          role: loggedInUserRole,
          allUpcoming,
          csrfToken: request.csrfToken(),
        });
      } else {
        response.json({
          allSports,
          allUpcoming,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

app.post("/sport",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Creating a sport", request.body);
    try {
      const sport = await Sport.addSport({
        title: request.body.title,
        userId: request.user.id,
      });
      return response.redirect("/sport");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  if (request.body.password.length < 8) {
    request.flash("error", "Password length can't less than 8");
    return response.redirect("/signup");
  }
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      role: request.body.role,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/sport");
    });
  } catch (error) {
    console.log(error);
    request.flash("error", error.errors[0].message);
    return response.redirect("/signup");
  }
});

app.post("/createSession/:sportId",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    if (request.body.playersNeeded < 0) {
      request.flash("error", "Number of players needed can't less than 0");
      return response.redirect(`/sport/sessions/${request.params.sportId}`);
    }
    console.log(request.body);
    try {
      console.log("Sessions name", request.body.sessionName);
      const session = await Sessions.addSession({
        sessionName: request.body.sessionName,
        date: request.body.date,
        time: request.body.time,
        venue: request.body.venue,
        playersNeeded: request.body.playersNeeded,
        userId: request.user.id,
        sportId: request.params.sportId,
      });
      console.log(session);
      const names = request.body.names;
      const nameArr = names.split(",");
      console.log(session.id);
      for (let i = 0; i < nameArr.length; i++) {
        await playerSessions.create({
          player_name: nameArr[i],
          session_id: session.id,
        });
      }
      return response.redirect(`/sport/${request.params.sportId}`);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/login", (request, response) => {
  if (request.user) {
    return response.redirect("/sport");
  }
  return response.render("login", {
    title: "Login",
    csrfToken: request.csrfToken(),
  });
});

app.post("/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/sport");
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.get("/createSport",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    console.log(request.user.id);
    const allSportsPart = await Sport.UsergetSports(request.user.id);
    console.log(allSportsPart);
    try {
      response.render("createSpt", {
        csrfToken: request.csrfToken(),
        allSportsPart,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.get("/sport/:sportId",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    console.log("We have to consider sport with ID:", request.params.sportId);
    const sport = await Sport.findByPk(request.params.sportId);
    const allSessionPart = await Sessions.UsergetSession(
      request.user.id,
      request.params.sportId
    );
    const allSportSessions = await Sessions.SportSessions(
      request.params.sportId
    );
    let allUpcoming = await Sessions.UpSessions(allSportSessions);
    console.log(allUpcoming);
    allUpcoming = await Sessions.UncancelSess(allUpcoming);
    const userRole = request.user.role;
    if (request.accepts("html")) {
      try {
        response.render("ParticularSpt", {
          title: sport.title,
          sport,
          allSessionPart,
          allUpcoming,
          userRole,
          csrfToken: request.csrfToken(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      response.json({
        allSessionPart,
        allUpcoming,
        sport,
      });
    }
  }
);

app.get("/sport/sessions/:sportId",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    const sport = await Sport.findByPk(request.params.sportId);
    try {
      response.render("createSession", {
        title: sport.title,
        sport,
        csrfToken: request.csrfToken(),
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// ✅ View Reports Page Route
app.get("/viewReports", connectEnsureLogin.ensureLoggedIn(), (request, response) => {
  response.render("viewReports", {
    title: "View Reports",
    csrfToken: request.csrfToken(), // ✅ Ensuring CSRF Token Works
  });
});

// ✅ Process Report Request
app.post("/viewReports", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  try {
    let { date1, date2 } = request.body;

    // Convert to Date objects
    date1 = new Date(date1);
    date2 = new Date(date2);

    // Validate date inputs
    if (isNaN(date1.getTime()) || isNaN(date2.getTime()) || date1 > date2) {
      request.flash("error", "Invalid date range. Please enter valid dates.");
      return response.redirect("/viewReports");
    }

    // Fetch sessions within the given date range
    const reports = await Sessions.findAll({
      where: {
        date: {
          [Op.between]: [date1, date2],
        },
      },
      include: [{ model: Sport }, { model: User }],
    });

    if (reports.length === 0) {
      request.flash("info", "No reports found for the selected date range.");
      return response.redirect("/viewReports");
    }

    response.render("reportResults", {
      title: "Reports",
      reports,
      csrfToken: request.csrfToken(),
    });

  } catch (error) {
    console.error("Error fetching reports:", error);
    request.flash("error", "Something went wrong while fetching reports.");
    response.redirect("/viewReports");
  }
});

app.get("/sport/viewPreSessions/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log("📌 Received Request for Previous Sessions");
  console.log("➡ Sport ID from URL:", req.params.id);

  const sportId = parseInt(req.params.id, 10); // Convert to integer
  console.log("🔢 Parsed Sport ID:", sportId);

  if (isNaN(sportId)) {
    console.log("❌ Invalid sport ID detected!");
    req.flash("error", "Invalid sport ID.");
    return res.redirect("/sport");
  }

  try {
    const sport = await Sport.findByPk(sportId);
    console.log("🔎 Sport found:", sport ? sport.title : "Not found");

    if (!sport) {
      console.log("❌ Sport not found! Redirecting...");
      req.flash("error", "Sport not found.");
      return res.redirect("/sport");
    }

    const allPrevious = await Session.findAll({
      where: { sportId: sportId },
      order: [["date", "DESC"]],
    });

    console.log("📜 Total Previous Sessions found:", allPrevious.length);

    res.render("prevSession", {
      sport,
      allPrevious,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error("🔥 Error fetching sessions:", error);
    req.flash("error", "Failed to load previous sessions.");
    res.redirect("/sport");
  }
});

app.post("/sport/viewPreSessions/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const sportId = parseInt(req.params.id, 10);
  if (isNaN(sportId)) {
    req.flash("error", "Invalid sport ID.");
    return res.redirect("/sport");
  }

  try {
    const sport = await Sport.findByPk(sportId);
    if (!sport) {
      req.flash("error", "Sport not found.");
      return res.redirect("/sport");
    }

    await Session.create({
      sportId: sportId,
      sessionName: req.body.sessionName,
      date: req.body.date,
      time: req.body.time,
      playersNeeded: req.body.playersNeeded || 0,
      canceled: req.body.canceled || false,
      message: req.body.message || "",
    });

    req.flash("success", "Session added successfully.");
    res.redirect(`/sport/viewPreSessions/${sportId}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to add session.");
    res.redirect(`/sport/viewPreSessions/${sportId}`);
  }
});

app.get("/sport/edit/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const sportId = parseInt(req.params.id, 10); // Convert to integer
  if (isNaN(sportId)) {
    req.flash("error", "Invalid sport ID.");
    return res.redirect("/sport");
  }

  try {
    const sport = await Sport.findByPk(sportId);
    if (!sport) {
      req.flash("error", "Sport not found.");
      return res.redirect("/sport");
    }

    res.render("editSport", {
      sport,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong.");
    res.redirect("/sport");
  }
});

app.post("/sport/edit/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const sportId = parseInt(req.params.id, 10);
  
  if (isNaN(sportId)) {
    req.flash("error", "Invalid sport ID.");
    return res.redirect("/sport");
  }

  if (!req.body.title || req.body.title.trim() === "") {
    req.flash("error", "Sport name cannot be empty.");
    return res.redirect(`/sport/edit/${sportId}`);
  }

  try {
    const sport = await Sport.findByPk(sportId);
    if (!sport) {
      req.flash("error", "Sport not found.");
      return res.redirect("/sport");
    }

    await sport.update({ title: req.body.title.trim() });

    req.flash("success", "Sport updated successfully.");
    res.redirect(`/sport`);
  } catch (error) {
    console.error("Error updating sport:", error.message);
    req.flash("error", "Failed to update sport.");
    res.redirect(`/sport/edit/${sportId}`);
  }
});

app.delete("/sport/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const sportId = parseInt(req.params.id, 10);

  if (isNaN(sportId)) {
    return res.status(400).json({ error: "Invalid sport ID." });
  }

  try {
    const sport = await Sport.findByPk(sportId);
    if (!sport) {
      return res.status(404).json({ error: "Sport not found." });
    }

    await sport.destroy();
    res.status(200).json({ message: "Sport deleted successfully." });
  } catch (error) {
    console.error("Error deleting sport:", error);
    res.status(500).json({ error: "Failed to delete sport." });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
