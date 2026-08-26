const prisma = require("../lib/prisma");

const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patientProfile.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            accountStatus: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const formattedPatients = patients.map((patient) => ({
      id: patient.userId,
      patientName: `${patient.user.firstName} ${patient.user.lastName}`,
      gender: patient.gender,
      status: patient.user.accountStatus,
    }));

    res.status(200).json({
      message: "Patients fetched successfully",
      patients: formattedPatients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patientProfile.findUnique({
      where: { userId: Number(id) },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
            accountStatus: true,
            createdAt: true,
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient fetched successfully",
      patient: {
        id: patient.id,
        firstName: patient.user.firstName,
        lastName: patient.user.lastName,
        emailAddress: patient.user.emailAddress,
        phoneNumber: patient.user.phoneNumber,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        occupation: patient.occupation,
        nationality: patient.nationality,
        address: patient.address,
        status: patient.user.accountStatus,
        registeredAt: patient.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching patient:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
};
