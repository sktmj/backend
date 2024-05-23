// Declaration Controller

import pool from "../config/db.js";
// Declaration: "",
// Goal: "",
// RoleModel: "",
// RoleModelWhy: "",
// OurJobDtl: "",
// KnownJobPlus: "",
// KnownJobMinus: "",

export const UpdateDeclaration = async (req, res) => {
  console.log(req.body,"jjjjj")
  try {
    const {
      Declaration,
      Goal,
      RoleModel,
      RoleModelWhy,
      OurJobDtl,
      KnownJobPlus,
      KnownJobMinus,
    } = req.body;
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
        UPDATE ApplicationForm
        SET Declaration = @Declaration,
        Goal = @Goal,
        RoleModel = @RoleModel,
        RoleModelWhy = @RoleModelWhy,
        OurJobDtl = @OurJobDtl,
        KnownJobPlus = @KnownJobPlus,
        KnownJobMinus = @KnownJobMinus
        WHERE AppId = @AppId;
      `;

    const request = pool.request();
    request.input("Declaration", Declaration);
    request.input("Goal", Goal);
    request.input("RoleModel", RoleModel);
    request.input("RoleModelWhy", RoleModelWhy);
    request.input("OurJobDtl", OurJobDtl);
    request.input("KnownJobPlus", KnownJobPlus);
    request.input("KnownJobMinus", KnownJobMinus);
    request.input("AppId", AppId);

    await request.query(query);

    res.status(200).json({
      success: true,
      message: "Declaration updated successfully",
    });
  } catch (error) {
    console.error("Error updating Declaration:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDeclarationDetails = async (req, res) => {
  try {
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
            SELECT *
            FROM ApplicationForm
            WHERE AppId = @AppId
          `;

    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      console.log("AppQualifications retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No AppQualifications found for the given AppId");
      res
        .status(404)
        .json({ success: false, message: "No AppQualifications found" });
    }
  } catch (error) {
    console.error("Error fetching AppQualifications:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
