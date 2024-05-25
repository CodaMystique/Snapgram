export default function validatePostData(data) {
  const { caption, tags, location } = data;

  // // Check if file type is allowed
  // const allowedFileTypes = ["image/png", "image/jpeg", "image/svg+xml"];
  // if (!allowedFileTypes.includes(file.type)) {
  //   return {
  //     success: false,
  //     error: "Only PNG, JPG, and SVG files are allowed.",
  //   };
  // }

  if (
    typeof caption !== "string" ||
    caption.length < 5 ||
    caption.length > 2200
  ) {
    return {
      success: false,
      error: "Caption must be a string between 5 and 2200 characters.",
    };
  }

  if (
    typeof location !== "string" ||
    location.length === 0 ||
    location.length > 1000
  ) {
    return {
      success: false,
      error:
        "Location must be a non-empty string with a maximum length of 1000 characters.",
    };
  }

  if (typeof tags !== "string") {
    return { success: false, error: "Tags must be a string." };
  }

  return { success: true, message: "Successful post validation." };
}
