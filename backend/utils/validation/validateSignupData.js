import isValidEmail from "./isValidEmail.js";
import isStrongPassword from "./isStrongPassword.js";

export default function validateSignupData(data) {
  const { name, username, email, password } = data;

  // Validation for name
  if (typeof name !== "string" || name.length < 1 || name.length > 30) {
    return {
      success: false,
      error: "Name must be a string between 1 and 30 characters.",
    };
  }

  // Validation for username
  if (
    typeof username !== "string" ||
    username.length < 1 ||
    username.length > 30
  ) {
    return {
      success: false,
      error: "Username must be a string between 1 and 30 characters.",
    };
  }

  // Validation for email
  if (typeof email !== "string" || !isValidEmail(email)) {
    return { success: false, error: "Invalid email format." };
  }

  // Validation for password
  if (typeof password !== "string" || password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long.",
    };
  }
  if (!isStrongPassword(password)) {
    return {
      success: false,
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    };
  }

  return { success: true, message: "Successful signup validation." };
}
