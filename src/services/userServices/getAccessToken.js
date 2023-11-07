import { StatusCodes } from "http-status-codes";
import request from "request";

const getAccessTokenService = async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Token required.",
    };
  }
  return new Promise((resolve, reject) => {
    request.post(
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyDKwh8lcC5jFJcFDtImtzVx0Bk7DQGL0yc",
      {
        json: true,
        body: {
          grant_type: "refresh_token",
          refresh_token: token,
        },
      },
      (error, response, body) => {
        if (!error && response.statusCode == StatusCodes.OK) {
          resolve(body);
        } else {
          reject(error);
        }
      }
    );
  });
};

export default getAccessTokenService;
