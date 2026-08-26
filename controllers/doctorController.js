const prisma = require("../lib/prisma");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        verificationStatus: "APPROVED",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
          },
        },
        specialty: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
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
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getDoctorsBySpecialty = async (req, res) => {
  const { specialtyId } = req.params;

  try {
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        specialtyId: Number(specialtyId),
        verificationStatus: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
            gender: true,
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

    const now = new Date();

    const formattedDoctors = doctors.map((doctor) => {
      const isActive =
        doctor.lastActiveAt &&
        now.getTime() - new Date(doctor.lastActiveAt).getTime() < 5 * 60 * 1000;

      return {
        doctorId: doctor.id,
        userId: doctor.user.id,
        doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
        emailAddress: doctor.user.emailAddress,
        phoneNumber: doctor.user.phoneNumber,
        gender: doctor.user.gender,
        specialty: doctor.specialty.name,
        availability: isActive ? "AVAILABLE" : "UNAVAILABLE",
        yearsOfPractice: doctor.yearsOfPractice,
        placeOfPractice: doctor.placeOfPractice,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      doctors: formattedDoctors,
    });
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getApprovedDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await prisma.doctorProfile.findFirst({
      where: {
        id: Number(id),
        verificationStatus: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
            gender: true,
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
        message: "Doctor not found or is not approved",
      });
    }

    const now = new Date();

    const isActive =
      doctor.lastActiveAt &&
      now.getTime() - new Date(doctor.lastActiveAt).getTime() < 5 * 60 * 1000;

    res.status(200).json({
      success: true,
      doctor: {
        doctorId: doctor.id,
        userId: doctor.user.id,
        doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
        emailAddress: doctor.user.emailAddress,
        phoneNumber: doctor.user.phoneNumber,
        gender: doctor.user.gender,
        specialty: doctor.specialty.name,
        availability: isActive ? "AVAILABLE" : "UNAVAILABLE",
        yearsOfPractice: doctor.yearsOfPractice,
        placeOfPractice: doctor.placeOfPractice,
      },
    });
  } catch (error) {
    console.error("Error fetching approved doctor:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateDoctorActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await prisma.doctorProfile.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    if (doctor.verificationStatus !== "APPROVED") {
      return res.status(403).json({
        message: "Doctor is not approved",
      });
    }

    await prisma.doctorProfile.update({
      where: {
        id: doctor.id,
      },
      data: {
        lastActiveAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Doctor activity updated",
    });
  } catch (error) {
    console.error("Error updating doctor activity:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialty,
  getApprovedDoctorById,
  updateDoctorActivity,
};
