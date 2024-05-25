import isValidEmail from "./isValidEmail.js";
import isStrongPassword from "./isStrongPassword.js";

export default function validateLoginData(data) {
  const { email, password } = data;

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

  return { success: true };
}
