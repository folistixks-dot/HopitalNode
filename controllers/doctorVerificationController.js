const prisma = require("../lib/prisma");

const submitVerification = async (req, res) => {
  const { homeAddress, bvn, medicalLicenseNumber } = req.body;

  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // Prevent duplicate submission
    const existingVerification = await prisma.doctorVerification.findUnique({
      where: {
        doctorId: doctor.id,
      },
    });

    if (existingVerification) {
      return res.status(400).json({
        message: "Verification has already been submitted.",
      });
    }

    if (!homeAddress) {
      return res.status(400).json({
        message: "Home address is required",
      });
    }

    // Create verification
    const verification = await prisma.doctorVerification.create({
      data: {
        doctorId: doctor.id,
        homeAddress,
        bvn,
        medicalLicenseNumber,
      },
    });

    // Save uploaded files
    if (req.files?.idDocument) {
      await prisma.verificationDocument.create({
        data: {
          verificationId: verification.id,
          documentType: "ID_DOCUMENT",
          fileUrl: `/uploads/${req.files.idDocument[0].filename}`,
        },
      });
    }

    if (req.files?.medicalLicense) {
      await prisma.verificationDocument.create({
        data: {
          verificationId: verification.id,
          documentType: "MEDICAL_LICENSE",
          fileUrl: `/uploads/${req.files.medicalLicense[0].filename}`,
        },
      });
    }

    if (req.files?.proofOfAddress) {
      await prisma.verificationDocument.create({
        data: {
          verificationId: verification.id,
          documentType: "PROOF_OF_ADDRESS",
          fileUrl: `/uploads/${req.files.proofOfAddress[0].filename}`,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Verification submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getVerificationStatus = async (req, res) => {
  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const verification = await prisma.doctorVerification.findUnique({
      where: {
        doctorId: doctor.id,
      },
      include: {
        documents: true,
      },
    });

    if (!verification) {
      return res.status(404).json({
        message: "Verification has not been submitted.",
      });
    }

    res.status(200).json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  submitVerification,
  getVerificationStatus,
};
