const { default: axios } = require("axios");
const { getAccessToken } = require("../auth");

let accessToken;
getAccessToken((err, token) => {
  if (err) {
    console.error(err);
    return;
  }
  accessToken = token;
});

const deleteObject = async (BUCKET_KEY, OBJECT_NAME) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": `application/octet-stream`,
  };
  const url = `https://developer.api.autodesk.com/oss/v2/buckets/${BUCKET_KEY}/objects/${OBJECT_NAME}`;

  try {
    const response = await axios.delete(url, { headers });
    if (response.status === 200) {
      console.log(`Object ${OBJECT_NAME} deleted successfully line 23.`);
    } else {
      console.log(`Error deleting object ${OBJECT_NAME}: ${response.status} line 25`);
    }
  } catch (error) {
    console.log(error)
    console.error(`Error deleting object ${OBJECT_NAME}: line 29`, error);
  }
};

module.exports = { deleteObject };
