const prisma = require("../lib/prisma");

const getAllVerificationRequests = async (req, res) => {
  try {
    const verifications = await prisma.doctorVerification.findMany({
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                emailAddress: true,
              },
            },
            specialty: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    const formatted = verifications.map((verification) => ({
      doctorId: verification.doctor.user.id,
      doctorProfileId: verification.doctor.id,
      doctorName: `${verification.doctor.user.firstName} ${verification.doctor.user.lastName}`,
      emailAddress: verification.doctor.user.emailAddress,
      specialty: verification.doctor.specialty.name,
      status: verification.status,
      submittedAt: verification.submittedAt,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      verifications: formatted,
    });
  } catch (error) {
    console.error("Error fetching verification requests:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateVerificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminRemark } = req.body;

  try {
    // Validate status
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Status must be APPROVED or REJECTED",
      });
    }

    // Find the verification request
    const verification = await prisma.doctorVerification.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!verification) {
      return res.status(404).json({
        message: "Verification request not found",
      });
    }

    // Update verification and doctor profile together
    const updatedVerification = await prisma.$transaction(async (tx) => {
      const updated = await tx.doctorVerification.update({
        where: {
          id: Number(id),
        },
        data: {
          status,
          adminRemark: adminRemark || null,
        },
      });

      await tx.doctorProfile.update({
        where: {
          id: verification.doctorId,
        },
        data: {
          verificationStatus: status,
        },
      });

      return updated;
    });

    res.status(200).json({
      success: true,
      message: `Doctor verification ${status.toLowerCase()} successfully.`,
      verification: updatedVerification,
    });
  } catch (error) {
    console.error("Error updating verification status:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getVerificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const verification = await prisma.doctorVerification.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        doctor: {
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
        },
        documents: true,
      },
    });

    if (!verification) {
      return res.status(404).json({
        message: "Verification request not found",
      });
    }

    res.status(200).json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error("Error fetching verification:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllVerificationRequests,
  updateVerificationStatus,
  getVerificationById,
};
