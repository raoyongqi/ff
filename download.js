const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');

// Set the file paths
const filePath = path.join('C:', 'Users', 'r', 'Desktop', 'Mp3', 'BV1Aq4y1o7p2', 'BV1Aq4y1o7p2_16_16.json');
const aria2cPath = 'C:\\aria2c\\aria2c.exe';
const ffmpegPath = 'C:\\ffmpeg\\ffmpeg.exe'; // Absolute path to ffmpeg executable

// Read the JSON file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Extract the baseUrl and item["id"] for audio
const audioData = data[0].data.dash.audio;
const baseUrls = audioData.map(item => item.baseUrl);
const ids = audioData.map(item => item.id); // Get the id for each audio segment

// Define the headers
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  'Referer': 'https://www.bilibili.com'
};

// Function to download file using aria2c with headers
function downloadFileWithAria2(url, filename, headers) {
  // Construct the aria2c command
  let command = `${aria2cPath} --out=${filename}`;
  
  // Add custom headers
  Object.keys(headers).forEach(header => {
    command += ` --header="${header}: ${headers[header]}"`;
  });
  
  // Add the download URL
  command += ` "${url}"`;
  
  // Execute the command
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`Downloaded: ${filename}`);
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error.message);
  }
}

// Function to download and merge audio segments (if required)
async function downloadAndMerge(baseUrls, ids, outputFilename, headers) {
  const tempFiles = [];

  // Download each audio file
  for (let idx = 0; idx < baseUrls.length; idx++) {
    const baseUrl = baseUrls[idx];
    const id = ids[idx];
    const url = baseUrl + id; // Construct the URL for each segment
    const tempFilename = `${path.basename(filePath, '.json')}_${idx}.m4s`; // Generate filename based on file path and id

    downloadFileWithAria2(url, tempFilename, headers);
    tempFiles.push(tempFilename);
  }

  // Merging logic (Optional): Use ffmpeg to merge m4s segments into one final file (like an m4a or mp3)
  if (tempFiles.length > 0) {
    const mergeCommand = `${ffmpegPath} -i "concat:${tempFiles.join('|')}" -c copy ${outputFilename}`;
    try {
      execSync(mergeCommand, { stdio: 'inherit' });
      console.log(`Merged and saved as ${outputFilename}`);

      // Clean up temporary files after merging
      tempFiles.forEach(file => fs.unlinkSync(file));
    } catch (error) {
      console.error(`Error merging files:`, error.message);
    }
  }
}

// Define the final output file (based on the JSON file's name)
const outputM4A = path.join(path.dirname(filePath), `${path.basename(filePath, '.json')}.m4a`);

// Execute the download and merge operation
downloadAndMerge(baseUrls, ids, outputM4A, headers);
