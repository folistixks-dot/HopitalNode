const prisma = require("../lib/prisma");

const getAllDoctors = async (req, res) => {
  try {
    const { status } = req.query;

    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use PENDING, APPROVED, or REJECTED.",
      });
    }

    const doctors = await prisma.doctorProfile.findMany({
      where: status
        ? {
            verificationStatus: status,
          }
        : undefined,

      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
            gender: true,
            accountStatus: true,
          },
        },
        specialty: {
          select: {
            name: true,
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });

    const formattedDoctors = doctors.map((doctor) => ({
      doctorId: doctor.id,
      userId: doctor.user.id,
      doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
      emailAddress: doctor.user.emailAddress,
      phoneNumber: doctor.user.phoneNumber,
      gender: doctor.user.gender,
      specialty: doctor.specialty.name,
      availability: doctor.availability,
      verificationStatus: doctor.verificationStatus,
      accountStatus: doctor.user.accountStatus,
      yearsOfPractice: doctor.yearsOfPractice,
      placeOfPractice: doctor.placeOfPractice,
    }));

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      doctors: formattedDoctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getDoctorById = async (req, res) => {
  const { userId } = req.params;

  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: {
        userId: Number(userId),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
            gender: true,
            accountStatus: true,
            createdAt: true,
          },
        },
        specialty: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor: {
        id: doctor.userId,
        name: `${doctor.user.firstName} ${doctor.user.lastName}`,
        emailAddress: doctor.user.emailAddress,
        phoneNumber: doctor.user.phoneNumber,
        gender: doctor.user.gender,
        status: doctor.user.accountStatus,
        specialty: doctor.specialty.name,
        yearsOfPractice: doctor.yearsOfPractice,
        placeOfPractice: doctor.placeOfPractice,
        availability: doctor.availability,
        createdAt: doctor.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
};
