import ffmpeg from "fluent-ffmpeg";
import path from "path";

export const compressVideo = (
  inputPath,
  outputPath,
  thumbnailPath,
  callback
) => {
  const uploadsDir = "uploads";

  ffmpeg(inputPath)
    .outputOptions([
      "-vf scale=1280:-1", // Scale to 720p width
      "-b:v 1M", // Set bitrate
      "-r 30", // Frame rate
      "-c:v libx264", // Video codec
      "-crf 23", // Quality
      "-preset medium", // Encoding speed
      "-c:a aac", // Audio codec
      "-b:a 128k", // Audio bitrate
      "-movflags +faststart", // Streaming optimization
      // `drawtext=text='TURANT NEWS':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=10`, // Watermark
    ])
    .on("end", () => {
      console.log("Compression completed!");

      // Generate thumbnail
      ffmpeg(inputPath)
        .on("end", () => {
          console.log("Thumbnail generated!");
          callback(null); // Call back with no error
        })
        .on("error", (err) => {
          console.error("Thumbnail generation failed:", err);
          callback(err); // Pass the error back
        })
        .screenshots({
          count: 1,
          folder: uploadsDir,
          filename: path.basename(thumbnailPath),
          size: "320x?", // Maintain aspect ratio
        });
    })
    .on("error", (err) => {
      console.error("Compression failed:", err);
      callback(err); // Pass compression error back
    })
    .save(path.join(uploadsDir, outputPath)); // Save compressed video
};
