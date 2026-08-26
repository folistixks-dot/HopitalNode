const prisma = require("../lib/prisma");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDoctors,
      totalPatients,
      pendingDoctors,
      approvedDoctors,
      rejectedDoctors,
    ] = await Promise.all([
      prisma.doctorProfile.count(),

      prisma.patientProfile.count(),

      prisma.doctorProfile.count({
        where: {
          verificationStatus: "PENDING",
        },
      }),

      prisma.doctorProfile.count({
        where: {
          verificationStatus: "APPROVED",
        },
      }),

      prisma.doctorProfile.count({
        where: {
          verificationStatus: "REJECTED",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        pendingDoctors,
        approvedDoctors,
        rejectedDoctors,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getDashboardStats,
};
