require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { userModel, urlModel } = require('../model/mongooseSchema');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const QRCode = require('qrcode');
const shortid = require('shortid');

// JWT Passport Strategy Configuration
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Controller Functions
const registerControll = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existedUser = await userModel.findOne({ username });
    const existedMail = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(409).json({ message: 'Username is already taken' });
    }
    if (existedMail) {
      return res.status(409).json({ message: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};




const allGet = async (req, res) => {
  try {
    const tasks = await urlModel.find({ user: req.user._id });
    console.log(req.user._id);
    res.status(200).send(tasks);
} catch (error) {
    res.status(500).send("Data is not displaying, something went wrong");
}
};




const auth = passport.authenticate('jwt', { session: false });





const loginControll = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find user by username or email
    const query = email ? { email } : { username };
    const existedUser = await userModel.findOne(query);

    if (!existedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, existedUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password does not match' });
    }

    // Create JWT payload and token
    const payload = { id: existedUser._id, username: existedUser.username, email: existedUser.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Respond with success and user data
    res.status(200).json({
        username: existedUser.username,
        email: existedUser.email,
        token: 'Bearer ' + token,
      },
    );
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};






const homeGetRoute = async (req, res) => {
  const { shortUrl } = req.params;

  if (!shortUrl) {
    return res.status(400).json({ message: 'Short URL parameter is missing.' });
  }

  try {
    // Find the URL document by shortUrl
    const url = await urlModel.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found.' });
    }

    // Increment the clicks and save the updated document
    url.clicks += 1;
    await url.save();

    // Redirect to the original URL
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(`Error in homeGetRoute: ${error.message}`);
    return res.status(500).json({ message: 'Server error occurred.', error: error.message });
  }
};





const homePostRoute = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required.' });
  }

  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User is required.' });
    }

    let url = await urlModel.findOne({ originalUrl, user: userId });
    if (url) {
      return res.status(200).json({
        message: 'URL already shortened.',
        data: {
          originalUrl: url.originalUrl,
          shortUrl: `${req.headers.host}/${url.shortUrl}`,
          qrCode: url.qrCode,
        },
      });
    }

    const shortUrl = shortid.generate();
    const qrCode = await QRCode.toDataURL(`${req.headers.host}/${shortUrl}`);

    url = new urlModel({
      originalUrl,
      shortUrl,
      qrCode,
      user: userId, 
    });

    await url.save();

    res.status(201).json({
      message: 'Short URL created successfully.',
      data: {
        originalUrl,
        shortUrl: `${req.headers.host}/${shortUrl}`,
        qrCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


const homeDeleteRoute = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await urlModel.findOneAndDelete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    res.status(200).json({
      message: 'Short URL deleted successfully',
      data: { data },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerControll, loginControll, allGet, homeGetRoute, auth, homePostRoute, homeDeleteRoute };
