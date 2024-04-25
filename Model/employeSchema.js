// import { DataTypes, Model } from 'sequelize';
// import sql from 'mssql';
// import pool  from '../config/db.js';
// import Sequelize from 'sequelize';

// // Create Sequelize instance using the mssql connection pool
// const sequelize = new sql.Sequelize(pool);

// // Define the ApplicationForm model
// class ApplicationForm extends Model {
//   // You can define associations and other model configurations here
// }

// ApplicationForm.init(
//   {
//     AppId: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     AppDate: DataTypes.DATE,
//     AppName: DataTypes.STRING,
//     FatherName: DataTypes.STRING,
//     DOB: DataTypes.DATE,
//     Gender: DataTypes.STRING,
//     MobileNo: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     Passwrd: DataTypes.STRING, // Assuming password field is stored as plain text
//     // Add other fields based on the schema
//   },
//   {
//     sequelize,
//     modelName: 'ApplicationForm',
//     timestamps: false, // Assuming no timestamp fields in the table
//     underscored: true, // Use snake_case for column names
//     tableName: 'ApplicationForm', // Specify the table name if it differs from the model name
//   }
// );

// export default ApplicationForm;


// const trimmedAppName = AppName.slice(0, 100);
// const trimmedFatherName = FatherName.slice(0, 100);
// const trimmedDOB = DOB.slice(0, 10); // Assuming DOB is in the format 'YYYY-MM-DD'
// const trimmedGender = Gender.slice(0, 1);
// const trimmedMobileNo = MobileNo.slice(0, 15);
// const trimmedAadharNo = AadharNo.slice(0, 15);
// const trimmedPANNo = PANNo.slice(0, 15);
// const trimmedEmailId = EmailId.slice(0, 50);
// const trimmedMartialstatus = Martialstatus.slice(0, 1);
// const trimmedResAddress1 = ResAddress1.slice(0, 400);
// const trimmedResAddress2 = ResAddress2.slice(0, 100);
// const trimmedPerAddress1 = PerAddress1.slice(0, 400);
// const trimmedPerAddress2 = PerAddress2.slice(0, 100);
// const trimmedWorkCompany = WorkCompany.slice(0, 100);
// const trimmedRelieveReason = RelieveReason.slice(0, 100);
// const trimmedWorkComDtl = WorkComDtl.slice(0, 100);
// const trimmedExpectSalary = ExpectSalary.slice(0, 15); // Assuming numeric is being converted to string
// const trimmedExpDOJ = ExpDOJ.slice(0, 10); // Assuming ExpDOJ is in the format 'YYYY-MM-DD'
// const trimmedAreaRef = AreaRef.slice(0, 100);
// const trimmedAppStatus = AppStatus.slice(0, 1);
// const trimmedInterviewDate = InterviewDate.slice(0, 10); // Assuming InterviewDate is in the format 'YYYY-MM-DD'
// const trimmedDegree = Degree.slice(0, 100);
// const trimmedUserName = UserName.slice(0, 50);
// const trimmedPasswrd = Passwrd.slice(0, 50);
// const trimmedBloodGrp = BloodGrp.slice(0, 5);
// const trimmedMarriageDate = MarriageDate.slice(0, 10); // Assuming MarriageDate is in the format 'YYYY-MM-DD'
// const trimmedNativity = Nativity.slice(0, 50);
// const trimmedResPhoneNo = ResPhoneNo.slice(0, 15);
// const trimmedPerPhoneNo = PerPhoneNo.slice(0, 15);
// const trimmedLandMark = LandMark.slice(0, 100);
// const trimmedPassportNo = PassportNo.slice(0, 20);
// const trimmedIsPF = IsPF.slice(0, 1);
// const trimmedUANNo = UANNo.slice(0, 20);
// const trimmedIsRegEmpEx = IsRegEmpEx.slice(0, 1);
// const trimmedSalesExp = SalesExp.slice(0, 100);
// const trimmedHealthIssue = HealthIssue.slice(0, 100);
// const trimmedIsDriving = IsDriving.slice(0, 1);
// const trimmedLicenseNo = LicenseNo.slice(0, 20);
// const trimmedAltPerDtl = AltPerDtl.slice(0, 100);
// const trimmedIsCompWrkHere = IsCompWrkHere.slice(0, 1);
// const trimmedCompPerName = CompPerName.slice(0, 50);
// const trimmedCompPerSec = CompPerSec.slice(0, 30);
// const trimmedRefPerName = RefPerName.slice(0, 25);
// const trimmedRefPerAdd = RefPerAdd.slice(0, 100);
// const trimmedRefPerPhNo = RefPerPhNo.slice(0, 20);
// const trimmedFamilyReason = FamilyReason.slice(0, 1);
// const trimmedEarnMoney = EarnMoney.slice(0, 1);
// const trimmedGainExp = GainExp.slice(0, 1);
// const trimmedSocialSts = SocialSts.slice(0, 1);
// const trimmedBetterLife = BetterLife.slice(0, 1);
// const trimmedWrkInt = WrkInt.slice(0, 1);
// const trimmedCompBrand = CompBrand.slice(0, 1);
// const trimmedOthReason = OthReason.slice(0, 1);
// const trimmedIsAccNeed = IsAccNeed.slice(0, 1);
// const trimmedBranchTrns = BranchTrns.slice(0, 1);
// const trimmedNearByName1 = NearByName1.slice(0, 25);
// const trimmedNearByAdd1 = NearByAdd1.slice(0, 100);
// const trimmedNearByName2 = NearByName2.slice(0, 25);
// const trimmedNearByAdd2 = NearByAdd2.slice(0, 100);
// const trimmedOurJobDtl = OurJobDtl.slice(0, 100);
// const trimmedGoal = Goal.slice(0, 100);
// const trimmedKnownJobPlus = KnownJobPlus.slice(0, 100);
// const trimmedKnownJobMinus = KnownJobMinus.slice(0, 100);
// const trimmedRoleModel = RoleModel.slice(0, 100);
// const trimmedJobApplied = JobApplied.slice(0, 100);
// const trimmedPic = Pic.slice(0, 100);
// const trimmedRegExpExNo = RegExpExNo.slice(0, 30);
// const trimmedEPFNo = EPFNo.slice(0, 50);
// const trimmedResumeFileName = ResumeFileName.slice(0, 50);
// const trimmedJoinDate = JoinDate.slice(0, 10); // Assuming JoinDate is in the format 'YYYY-MM-DD'
// const trimmedPrfBranch = PrfBranch.slice(0, 100);
// const trimmedPrfSection = PrfSection.slice(0, 100);
// const trimmedPrfDesign = PrfDesign.slice(0, 100);
// const trimmedSecInc = SecInc.slice(0, 100);
// const trimmedEmpName = EmpName.slice(0, 100);
// const trimmedECNo = ECNo.slice(0, 50);
// const trimmedRoleModelWhy = RoleModelWhy.slice(0, 200);
// const trimmedKnowCompany = KnowCompany.slice(0, 200);
// const trimmedIsFresher = IsFresher.slice(0, 5);
// const trimmedCarLicenseDoc = CarLicenseDoc.slice(0, 100);
