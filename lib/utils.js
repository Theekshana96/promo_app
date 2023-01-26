const jsonwebtoken = require("jsonwebtoken");

function generateAuthToken(user) {
  const expiresIn = "2w";

  const payload = {
    sub: {
      id: user.id,
      name: user.userName,
      email: user.email,
      phone:user.phone,
      image: user.image,
    },
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: expiresIn }
  );

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone:user.phone,
      image: user.image,
    },
  };
}

function authMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(" ");

    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      try {
        const verification = jsonwebtoken.verify(
          tokenParts[1],
          process.env.ACCESS_TOKEN_SECRET
        );
        if (verification.sub.verified === false) {
          res
            .status(401)
            .json({
              success: false,
              status: "Unauthorized",
              msg: "You are not verified your email to access your account",
            });
        } else {
          req.jwt = verification;
        }
        next();
      } catch (err) {
        res
          .status(401)
          .json({
            success: false,
            status: "Unauthorized",
            msg: "You are not authorized to visit this route",
          });
      }
    } else {
      res
        .status(401)
        .json({
          success: false,
          status: "Unauthorized",
          msg: "You are not authorized to visit this route",
        });
    }
  } else {
    res
      .status(401)
      .json({
        success: false,
        status: "TokenError",
        msg: "You are not authorized to visit this route",
      });
  }
}

function generateAdminAuthToken(admin) {
  const expiresIn = '2w';

  const payload = {
    sub: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      status : "ADMIN"
    },
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign( payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn});

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  }
}

// function adminAuthMiddleware(req, res, next) {
//   if (req.headers.authorization) {
//     const tokenParts = req.headers.authorization.split(' ');

//     if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

//       try {
//         const verification = jsonwebtoken.verify(tokenParts[1], process.env.ACCESS_TOKEN_SECRET);
//         if(verification.sub.status=== "ADMIN"){
//           req.jwt = verification;
//           next();
//         }else{
//           res.status(210).json({ success: false, code:210, status: 'Unauthorized', msg: "You are not an admin" });
//         }

//       } catch (err) {
//         res.status(210).json({ success: false, code:210, status: 'Unauthorized', msg: "You are not authorized to visit this route" });
//       }

//     } else {
//       res.status(210).json({ success: false, code:210, status: 'Unauthorized', msg: "You are not authorized to visit this route" });
//     }
//   } else {
//     res.status(210).json({ success: false, code:210, status: 'TokenError', msg: "You are not authorized to visit this route" });
//   }
// }

module.exports.generateAuthToken = generateAuthToken;
module.exports.authMiddleware = authMiddleware;
module.exports.generateAdminAuthToken = generateAdminAuthToken;
// module.exports.adminAuthMiddleware = adminAuthMiddleware;
