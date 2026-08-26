const prisma = require("../lib/prisma");

const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      message: "Specialties fetched successfully",
      specialties,
    });
  } catch (error) {
    console.error("Error fetching specialties:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllSpecialties,
};
