const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        emailAddress: "admin@hospital.com",
      },
    });

    if (existingAdmin) {
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin123@", 10);

    const admin = await prisma.user.create({
      data: {
        firstName: "System",
        lastName: "Administrator",
        emailAddress: "admin@hospital.com",
        phoneNumber: "08000000000",
        gender: "Male",
        password: hashedPassword,
        role: {
          connect: {
            name: "ADMIN",
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

createAdmin();
