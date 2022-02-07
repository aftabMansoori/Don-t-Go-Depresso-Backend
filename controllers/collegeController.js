const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const College = require("../models/college");
const StudentMails = require("../models/studentMails");

const { catchAsync } = require("../Utils/ErrorHandling");

exports.signup = catchAsync(async (req, res) => {
  const {
    collegeCode,
    collegeName,
    password,
    confPassword,
    collegePhoneNo,
    collegeAddress,
    collegeLocation,
  } = req.body;
  if (password === confPassword) {
    let college = new College({
      collegeCode,
      collegeName,
      password,
      collegePhoneNo,
      collegeAddress,
      collegeLocation,
    });
    college.password = await bcrypt.hash(password, parseInt(process.env.Salt));
    const collegeCreated = await college.save();
    res.status(201).json({
      status: "Successful",
      message: collegeCreated.collegeName + " registered successfully",
    });
  } else {
    res.status(400).json({
      status: "Error",
      message: "Password is incorrect",
    });
  }
});

exports.signin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user,
      });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) throw err;
      const token = jwt.sign(
        { id: user._id.toJSON(), role: user.role },
        process.env.SECRET,
        {
          expiresIn: 604800,
        }
      );
      res.status(200).json({
        message: info.message,
        token: token,
        user: user,
      });
    });
  })(req, res, next);
  // passport.authenticate("local", { session: false }, (user, info, err) => {
  //   if (err || !user) {
  //     return res.status(400).json({
  //       message: info ? info.message : "Login failed",
  //       user: user,
  //     });
  //   }
  //   req.login(user, { session: false }, (err) => {
  //     if (err) throw err;
  //     const token = jwt.sign({ id: user._id.toJSON() }, process.env.SECRET, {
  //       expiresIn: 604800,
  //     });
  //     console.log(token);
  //     return res.status(200).json({ user, token });
  //   });
  // })(req, res, next);
};

exports.signout = (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: "signout Successfully" });
  } catch {
    res.status(401).json({ message: "Signing Out failed" });
  }
};

exports.studentMails = catchAsync(async (req, res) => {
  let { studentMail } = req.body;
  let mail = await StudentMails.findOne({ studentMail });

  if (mail) {
    res.status(400).json({
      status: "Error",
      message: "Mail already exists",
    });
  } else {
    mail = await new StudentMails({
      studentMail,
      studentClg: req.user.collegeName,
      studentClgCode: req.user.collegeCode,
    }).save();
    let college = await College.findOne({ collegeCode: req.user.collegeCode });
    college.studentMails.push(mail);
    college.save();
    res.status(201).json({
      status: "Successful",
      message: "Student email saved",
    });
  }
});

exports.getMails = catchAsync(async (req, res) => {
  let college = await College.find({
    collegeCode: req.user.collegeCode,
  }).populate("studentMails", "studentMail");
  res.status(200).json({
    status: "Successful",
    mails: college[0].studentMails,
  });
});

const ExcelJS = require("exceljs");
var xlsx = require("node-xlsx").default;

module.exports.getEmailExcel = catchAsync(async (req, res, next) => {
  let collegeData = await College.findOne({
    collegeCode: req.user.collegeCode,
  }).populate("studentMails", "studentMail");
  let collegeEmailsList = await Promise.all(
    collegeData.studentMails.map((el) => {
      return el.studentMail;
    })
  );
  let xlsFormat = await Promise.all(
    collegeEmailsList.map(async (email) => {
      let row = {};
      row.email = email;
      return row;
    })
  );
  res.xls("data.xlsx", xlsFormat);
});

module.exports.addEmailExcel = catchAsync(async (req, res, next) => {
  const excelfile = req.files[0];
  const workSheetsFromBuffer = xlsx.parse(excelfile.buffer);
  workSheetsFromBuffer[0].data.shift();
  let emailBulk = await Promise.all(
    workSheetsFromBuffer[0].data.map(async (el) => {
      if (el[0])
        return {
          studentMail: el[0],
          studentClgCode: req.user.collegeCode,
          studentClg: req.user._id,
        };
      else return null;
    })
  );
  emailBulk = emailBulk.filter((n) => n);
  const session = await StudentMails.startSession();
  await session.withTransaction(async () => {
    let createdMails = await StudentMails.create(emailBulk, {
      session: session,
    });
    let mail = await Promise.all(
      createdMails.map((el) => {
        return el._id;
      })
    );
    await College.findOneAndUpdate(
      { collegeCode: req.user.collegeCode },
      { $push: { studentMails: { $each: mail } } }
    );
    return createdMails;
  });
  res.status(201).json({
    message: "The Mails has been created",
  });
});
