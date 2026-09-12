import wholesalerService from "../services/wholeSaller.services.js";

export const signupWholesaler = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      phone,
      password,
      businessName,
      address,
    } = req.body;

    // Required fields
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, username and password are required",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const wholesaler =
      await wholesalerService.signupWholesaler({
        name,
        email,
        username,
        phone,
        password,
        businessName,
        address,
      });

    return res.status(201).json({
      success: true,
      message: "Wholesaler registered successfully",
      wholesaler,
    });
  } catch (error) {
    console.error("Wholesaler Signup Error:", error);

    if (
      error.message === "Email already registered" ||
      error.message === "Username already exists"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginWholesaler = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Identifier and password are required",
      });
    }

    const result = await wholesalerService.loginWholesaler(
      identifier,
      password
    );

    // IMPORTANT: Set JWT token in cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Wholesaler login successful",

      // Token can remain in response if other frontend code needs it
      token: result.token,

      id: result.wholesaler.id,
      name: result.wholesaler.name,
      email: result.wholesaler.email,
      username: result.wholesaler.username,
      wholesalerId: result.wholesaler.wholesalerId,
      role: "wholesaler",
      wholesaler: result.wholesaler,
    });
  } catch (error) {
    console.error("Wholesaler Login Error:", error);

    if (error.message === "Invalid wholesaler credentials") {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Wholesaler account is inactive") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
