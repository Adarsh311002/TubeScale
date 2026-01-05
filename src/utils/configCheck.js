import dotenv from "dotenv";
dotenv.config();

const checkConfig = () => {
  const requiredVars = [
    "MONGODB_URI",
    "PORT",
    "REDIS_URL",
    "CLOUDINARY_CLOUD_NAME",
    "ACCESS_TOKEN_SECRET",
  ];

  console.log("---  Environment Configuration Check ---");

  requiredVars.forEach((key) => {
    const value = process.env[key];
    if (!value) {
      console.error(`MISSING: ${key}`);
    } else {
      // Mask sensitive data for security while checking format
      const maskedValue =
        value.length > 10
          ? `${value.substring(0, 5)}...${value.substring(value.length - 3)}`
          : "***";
      console.log(` ${key}: ${maskedValue}`);
    }
  });

  console.log("------------------------------------------");
};

export { checkConfig };
