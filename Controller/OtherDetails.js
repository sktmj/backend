import { pool } from "../config/db.js";


export const getLocation= async (req, res) => {
  try {
    // Logic to fetch all courses from the database
    const result = await pool.request().query("SELECT * FROM FactoryMaster");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching Location:", error.message);
    res.status(500).json({ error: "Error fetching Location" });
  }
}




export const UpdateOthers = async (req, res) => {
console.log(req.body,"jjjjjjjj")
  try {
    const {
      CurrentSalary,
      ExpectSalary,
      KnowCompany,
      IsCompWrkHere,
      RefPerName,
      RefPerAdd,
      RefPerPhNo,
      FamilyReason,
      EarnMoney,
      GainExp,
      SocialSts,
      BetterLife,
      WrkInt,
      CompBrand,
      OthReason,
      ExpDOJ,
      IsAccNeed,
      SectionTrns,
      JobApplied,
      FactoryId,
      NearByName1,
      NearByAdd1,
      NearByCity1,
      NearByDistrict1,
      NearByState1,
      NearByCntry1,
      NearByPin1,
      NearByPhNo1,
      NearByTaluk1,
      NearByName2,
      NearByAdd2,
      NearByCity2,
      NearByDistrict2,
      NearByState2,
      NearByCntry2,
      NearByPin2,
      NearByPhNo2,
      NearByTaluk2,
    } = req.body;


    const AppId = req.headers.authorization.split(" ")[1];
console.log(AppId)
    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      UPDATE ApplicationForm
      SET CurrentSalary = @CurrentSalary,
          ExpectSalary = @ExpectSalary,
          KnowCompany= @KnowCompany,
          IsCompWrkHere = @IsCompWrkHere,
          RefPerName = @RefPerName,
          RefPerAdd = @RefPerAdd,
          RefPerPhNo = @RefPerPhNo,
          FamilyReason = @FamilyReason,
          EarnMoney = @EarnMoney,
          GainExp = @GainExp,
          SocialSts = @SocialSts,
          BetterLife=@BetterLife,
          WrkInt =@WrkInt,
          CompBrand=@CompBrand,
          OthReason=@OthReason,
          ExpDOJ=@ExpDOJ,
          IsAccNeed=@IsAccNeed,
          SectionTrns= @SectionTrns,
          JobApplied= @JobApplied,
          FactoryId= @FactoryId,
          NearByName1= @NearByName1,
          NearByAdd1=@NearByAdd1,
          NearByCity1=@NearByCity1,
          NearByDistrict1=@NearByDistrict1,
          NearByState1=@NearByState1,
          NearByCntry1=@NearByCntry1,
          NearByPin1=@NearByPin1,
          NearByPhNo1=@NearByPhNo1,
          NearByTaluk1=@NearByTaluk1,
          NearByName2=@NearByName2,
          NearByAdd2=@NearByAdd2,
          NearByCity2=@NearByCity2,
          NearByDistrict2=@NearByDistrict2,
          NearByState2=@NearByState2,
          NearByCntry2=@NearByCntry2,
          NearByPin2=@NearByPin2,
          NearByPhNo2=@NearByPhNo2,
          NearByTaluk2=@NearByTaluk2
      WHERE AppId = @AppId;
    `;

    const request = pool.request();

    request.input("CurrentSalary", CurrentSalary);
    request.input("ExpectSalary", ExpectSalary);
    request.input("KnowCompany", KnowCompany);
    request.input("IsCompWrkHere", IsCompWrkHere);
    request.input("RefPerName", RefPerName);
    request.input("RefPerAdd", RefPerAdd);
    request.input("RefPerPhNo", RefPerPhNo);
    request.input("FamilyReason", FamilyReason);
    request.input("EarnMoney", EarnMoney);
    request.input("GainExp", GainExp);
    request.input("SocialSts", SocialSts);
    request.input("BetterLife", BetterLife);
    request.input("WrkInt", WrkInt);
    request.input("CompBrand", CompBrand);
    request.input("OthReason", OthReason);
    request.input("ExpDOJ", ExpDOJ);
    request.input("IsAccNeed", IsAccNeed);
    request.input("SectionTrns", SectionTrns);
    request.input("JobApplied", JobApplied);
    request.input("FactoryId", FactoryId);
    request.input("NearByName1", NearByName1);
    request.input("NearByAdd1", NearByAdd1);
    request.input("NearByCity1", NearByCity1);
    request.input("NearByDistrict1", NearByDistrict1);
    request.input("NearByState1", NearByState1);
    request.input("NearByCntry1", NearByCntry1);
    request.input("NearByPin1", NearByPin1);
    request.input("NearByPhNo1", NearByPhNo1);
    request.input("NearByTaluk1", NearByTaluk1);
    request.input("NearByName2", NearByName2);
    request.input("NearByAdd2", NearByAdd2);
    request.input("NearByCity2", NearByCity2);
    request.input("NearByDistrict2", NearByDistrict2);
    request.input("NearByState2", NearByState2);
    request.input("NearByCntry2", NearByCntry2);
    request.input("NearByPin2", NearByPin2);
    request.input("NearByPhNo2", NearByPhNo2);
    request.input("NearByTaluk2", NearByTaluk2);
    request.input("AppId", AppId);

    await request.query(query);
  

    res.status(200).json({
      success: true,
      message: "Other Details updated successfully",
    });
  } catch (error) {
    console.error("Error updating Other Details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getOtherDetails = async (req, res) => {
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
