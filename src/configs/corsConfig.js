import cors from "cors";
export default cors({ credentials: true, origin: process.env.URL_FRONTEND })