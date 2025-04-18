import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-north-1_3Rrd5hO2t",
  ClientId: "b6ltvo55nq0kamcrmlbomp5hi",
};

export default new CognitoUserPool(poolData);
