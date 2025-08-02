export const PORT = process.env.PORT || 5000;
export const BASE_URL = process.env.BACKEND_URI || "http://localhost:"+PORT;

export const ARTIFACTS_URL = BASE_URL + "/api/artifacts";
export const NEWSLETTERS_URL = BASE_URL + "/api/newsletter";
export const COMMUNITY_URL = BASE_URL + "/api/community";
export const ARTIFACTS_BY_ID_URL = ARTIFACTS_URL + "/";
export const COMMUNITY_BY_ID_URL = COMMUNITY_URL + "/";
export const ARTIFACTS_BY_SEARCH_URL = ARTIFACTS_URL + "/search/";
export const COMMUNITY_BY_SEARCH_URL = COMMUNITY_URL + "/search/";


export const USER_LOGIN_URL = BASE_URL + "/api/users/login";
export const USER_REGISTER_URL = BASE_URL + "/api/users/signup";
export const GET_USER_LIST_URL = BASE_URL + `/api/users/getlist/${process.env.ACCESS_KEY}`;


export const POST_ARTIFACTS = ARTIFACTS_URL+"/";
export const POST_FEEDBACK = BASE_URL + "/api/feedback/";