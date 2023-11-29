const { getVideoDurationInSeconds } = require("get-video-duration");
const { Readable } = require("stream");

const getDuration = async (buffer) => {
  const fileStream = new Readable();
  fileStream.push(buffer);
  fileStream.push(null);

  try {
    const durationInSeconds = await getVideoDurationInSeconds(fileStream);
    return durationInSeconds;
  } catch (error) {
    return 0;
  }
};

module.exports = { getDuration };
