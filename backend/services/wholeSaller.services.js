import bcrypt  from "bcryptjs";
import jwt  from "jsonwebtoken";
import crypto  from "crypto";

import Wholesaler  from "../models/wholeSaller.model.js";

// ==========================================
// Generate Wholesaler ID
// ==========================================
const generateWholesalerId = () => {
  return `WH-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

// ==========================================
// SIGNUP
// ==========================================
const signupWholesaler = async (data) => {
  const {
    name,
    email,
    username,
    phone,
    password,
    businessName,
    address,
  } = data;

  // Check existing email
  const existingEmail = await Wholesaler.findOne({
    email: email.trim().toLowerCase(),
  });

  if (existingEmail) {
    throw new Error("Email already registered");
  }

  // Check existing username
  const existingUsername = await Wholesaler.findOne({
    username: username.trim(),
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate unique wholesaler ID
  let wholesalerId;
  let exists = true;

  while (exists) {
    wholesalerId = generateWholesalerId();

    exists = await Wholesaler.exists({
      wholesalerId,
    });
  }

  // Create wholesaler
  const wholesaler = await Wholesaler.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim(),
    phone: phone?.trim(),
    password: hashedPassword,
    businessName: businessName?.trim(),
    address: address?.trim(),
    wholesalerId,
    role: "wholesaler",
    isActive: true,
  });

  return {
    id: wholesaler._id,
    name: wholesaler.name,
    email: wholesaler.email,
    username: wholesaler.username,
    wholesalerId: wholesaler.wholesalerId,
    phone: wholesaler.phone,
    businessName: wholesaler.businessName,
    address: wholesaler.address,
    role: wholesaler.role,
  };
};

const loginWholesaler = async (identifier, password) => {
  const wholesaler = await Wholesaler.findOne({
    $or: [
      {
        email: identifier.trim().toLowerCase(),
      },
      {
        username: identifier.trim(),
      },
      {
        wholesalerId: identifier.trim(),
      },
    ],
  }).select("+password");

  if (!wholesaler) {
    throw new Error("Invalid wholesaler credentials");
  }

  if (wholesaler.isActive === false) {
    throw new Error("Wholesaler account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    wholesaler.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid wholesaler credentials");
  }

  const token = jwt.sign(
    {
      id: wholesaler._id,
      role: "wholesaler",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    wholesaler: {
      id: wholesaler._id,
      name: wholesaler.name,
      email: wholesaler.email,
      username: wholesaler.username,
      wholesalerId: wholesaler.wholesalerId,
      phone: wholesaler.phone,
      businessName: wholesaler.businessName,
      address: wholesaler.address,
      role: "wholesaler",
    },
  };
};
export default {
  signupWholesaler,
  loginWholesaler,
};