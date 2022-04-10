const fs = require('fs');
const os = require('os');
const path = require('path');
const { argv } = require('process');
const process = require('process');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

async function downloadVideo (arr) {

    for await(const video of arr) {

        console.log(video)

        let info = await ytdl.getInfo(video);
        let downloadedInfo = await ytdl.downloadFromInfo(info);
        let stream = fs.createWriteStream('/home/alina/node/video/audio'+ Math.random() + '.mp3');
            
        await ffmpeg(downloadedInfo)
            .audioBitrate(info.formats[0].audioBitrate)
            .withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .saveToFile(stream)
    }
}

(function createVideoArr (arr) {

    let videoArr = []
    for(let i=2; i<arr.length; i++) {

        videoArr.push(arr[i])
    }
    console.log(videoArr)
    downloadVideo(videoArr)
})(argv)