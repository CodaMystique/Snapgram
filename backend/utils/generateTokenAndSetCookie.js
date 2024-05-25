import jwt from "jsonwebtoken";

function generateTokenAndSetCookie(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.NODE_ENV === "development" ? "1d" : "6h",
  });

  const sixHoursInMilliseconds = 6 * 60 * 60 * 1000; // 6 hours

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours

  // Set JWT token as a cookie in the response
  res.cookie("jwt", token, {
    maxAge:
      process.env.NODE_ENV === "development"
        ? oneDayInMilliseconds
        : sixHoursInMilliseconds,
    httpOnly: true,
  });
}

export default generateTokenAndSetCookie;
