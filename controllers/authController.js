const prisma = require("../lib/prisma");

const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// const Register = async (req, res) => {
//   const { firstName, lastName, emailAddress, phoneNumber, password } = req.body;

//   try {
//     if (!firstName || !lastName || !emailAddress || !password) {
//       return res.status(400).json({
//         message: "Details required",
//       });
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { emailAddress },
//     });

//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await prisma.$transaction(async (tx) => {
//       const newUser = await tx.user.create({
//         data: {
//           firstName,
//           lastName,
//           emailAddress,
//           phoneNumber,
//           password: hashedPassword,
//           role: {
//             connect: {
//               name: "PATIENT",
//             },
//           },
//         },
//         include: {
//           role: true,
//         },
//       });

//       await tx.patientProfile.create({
//         data: {
//           userId: newUser.id,
//         },
//       });

//       return newUser;
//     });

//     //generate token
//     let payload = {
//       id: user.id,
//       email: user.emailAddress,
//       role: user.role.name,
//     };

//     let token = sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     const { password: _, ...safeUser } = user;

//     res.status(201).json({
//       message: "User Created Successfully",
//       user: safeUser,
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const registerPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    password,
    dateOfBirth,
    gender,
    occupation,
    nationality,
    address,
  } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !phoneNumber ||
      !password ||
      !dateOfBirth ||
      !gender ||
      !occupation ||
      !nationality ||
      !address
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        emailAddress,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          emailAddress,
          phoneNumber,
          password: hashedPassword,
          gender,
          role: {
            connect: {
              name: "PATIENT",
            },
          },
        },
        include: {
          role: true,
        },
      });

      await tx.patientProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(dateOfBirth),
          occupation,
          nationality,
          address,
        },
      });

      return user;
    });

    const token = jwt.sign(
      {
        id: result.id,
        role: result.role.name,
        email: result.emailAddress,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const { password: _, ...safeUser } = result;

    res.status(201).json({
      success: true,
      message: "Patient registered successfully.",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const registerDoctor = async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    password,
    gender,
    specialtyId,
    yearsOfPractice,
    placeOfPractice,
  } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !phoneNumber ||
      !password ||
      !gender ||
      !specialtyId ||
      yearsOfPractice === undefined ||
      !placeOfPractice
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        emailAddress,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    const specialty = await prisma.specialty.findUnique({
      where: {
        id: Number(specialtyId),
      },
    });

    if (!specialty) {
      return res.status(404).json({
        message: "Specialty not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          emailAddress,
          phoneNumber,
          password: hashedPassword,
          gender,
          role: {
            connect: {
              name: "DOCTOR",
            },
          },
        },
        include: {
          role: true,
        },
      });

      const doctorProfile = await tx.doctorProfile.create({
        data: {
          userId: user.id,
          specialtyId: Number(specialtyId),
          yearsOfPractice: Number(yearsOfPractice),
          placeOfPractice,
          availability: "UNAVAILABLE",
          // verificationStatus: "PENDING",
        },
      });

      // await tx.doctorRegistrationRequest.create({
      //   data: {
      //     doctorId: doctorProfile.id,
      //     status: "PENDING",
      //   },
      // });

      return user;
    });

    const token = jwt.sign(
      {
        id: result.id,
        role: result.role.name,
        email: result.emailAddress,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const { password: _, ...safeUser } = result;

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully.",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const Login = async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    if (!emailAddress || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        emailAddress,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    //generate token
    let payload = {
      id: user.id,
      email: user.emailAddress,
      role: user.role.name,
    };

    let token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        phoneNumber: true,
        gender: true,
        accountStatus: true,
        createdAt: true,

        role: {
          select: {
            id: true,
            name: true,
          },
        },

        patientProfile: {
          select: {
            id: true,
            dateOfBirth: true,
            occupation: true,
            nationality: true,
            address: true,
          },
        },

        doctorProfile: {
          select: {
            id: true,
            yearsOfPractice: true,
            placeOfPractice: true,
            availability: true,
            verificationStatus: true,
            specialty: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { phoneNumber, homeAddress } = req.body;

    // At least one field must be provided
    if (!phoneNumber && !homeAddress) {
      return res.status(400).json({
        message: "Please provide phone number or home address",
      });
    }

    // Find the logged-in user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
        patientProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update phone number on User
    if (phoneNumber) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          phoneNumber,
        },
      });
    }

    // PATIENT
    if (user.patientProfile) {
      if (homeAddress) {
        await prisma.patientProfile.update({
          where: {
            id: user.patientProfile.id,
          },
          data: {
            address: homeAddress,
          },
        });
      }
    }

    // DOCTOR
    if (user.doctorProfile) {
      if (homeAddress) {
        await prisma.doctorProfile.update({
          where: {
            id: user.doctorProfile.id,
          },
          data: {
            homeAddress,
          },
        });
      }
    }

    // Get updated user
    const updatedUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        phoneNumber: true,
        gender: true,
        accountStatus: true,

        role: {
          select: {
            id: true,
            name: true,
          },
        },

        patientProfile: {
          select: {
            id: true,
            dateOfBirth: true,
            occupation: true,
            nationality: true,
            address: true,
          },
        },

        doctorProfile: {
          select: {
            id: true,
            yearsOfPractice: true,
            placeOfPractice: true,
            homeAddress: true,
            availability: true,
            verificationStatus: true,
            specialty: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { emailAddress } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        emailAddress,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({
      email: user.emailAddress,
      subject: "Password Reset Request",
      message: `
        <h2>Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>
          Click the link below:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,

        // clear token after successful reset
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Check required fields
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "Old password, new password and confirm password are required",
      });
    }

    // Check that new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    // Don't allow the same password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from old password",
      });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare old password with hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Old password is incorrect",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  Login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};
