const express = require('express');
const app = express();
const ytdl = require("@distube/ytdl-core");
const { G4F } = require("g4f");
const g4f = new G4F();
const { cookies } = require('./cookies.js'); //RRR
const { myProxy } = require('./proxy.js'); //RRR
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("/",((n,e)=>{e.send('\n    <!DOCTYPE html>\n    <html lang="es">\n    <head>\n      <meta charset="UTF-8">\n      <meta name="viewport" content="width=device-width, initial-scale=1.0">\n      <title>@NeKosmic</title>\n      <style>\n        * {\n          margin: 0;\n          padding: 0;\n        }\n        body, html {\n          height: 100%;\n          width: 100%;\n          background-color: black;\n        }\n        .image-container {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          height: 100%;\n          width: 100%;\n          overflow: hidden;\n          position: relative;\n        }\n        .image-container img {\n          position: absolute;\n          min-width: 100%;\n          min-height: 100%;\n          object-fit: cover;\n          object-position: center;\n        }\n      </style>\n    </head>\n    <body>\n      <div class="image-container">\n        <a href="https://nekosmic.vercel.app/">\n          <img src="https://raw.githubusercontent.com/NeoKode/multimedia/refs/heads/main/NKhtml/Voyager_1.gif" alt="Bosque oscuro">\n        </a>\n      </div>\n    </body>\n    </html>\n  ')}));

app.get('/aichat', async (req, res) => {
  const { apikey, entrada, rol } = req.query;

  if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" })

  if (apikey === "sicuani") {
    try {
      const messages = [
        { role: "system", content: rol },
        { role: "user", content: entrada }
      ];
      const rpt = await g4f.chatCompletion(messages);
      return res.json({ status: true, chat: entrada, respuesta: rpt, version: "v1" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, respuesta: "Error interno del servidor" });
    }
  } else {
    return res.json({ status: false, respuesta: "adios mundo xd" });
  }
});

app.get('/ytdla', async (req, res) => {
  const { q, apikey } = req.query;
  if (!q || apikey !== "sicuani") {
    return res.status(400).json({ status: false, respuesta: "Faltan parámetros" });
  }

  try {
    const videoUrl = q;
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).send("Youtube! >:v");
    }
    
    const agent = ytdl.createProxyAgent({ uri: myProxy });
    const { formats, videoDetails } = await ytdl.getInfo(videoUrl, { agent });

    const bitrates = [48, 64, 160];
    let audioFormat = null;

    bitrates.some(bitrate => {
      audioFormat = formats.find(f => f.mimeType?.includes("audio/webm") && f.audioBitrate === bitrate && f.hasAudio);
      return audioFormat;
    });

    if (!audioFormat) {
      return res.status(400).send("Formato de audio no encontrado");
    }

    res.json(audioFormat);
    
  } catch (e) {
    res.json({ error: e.toString() });
  }
});

app.get('/ytdlv', async (req, res) => {
  const { q, apikey } = req.query;
  if (!q || apikey !== "sicuani") {
    return res.status(400).json({ status: false, respuesta: "Faltan parámetros" });
  }

  try {
    const videoUrl = q;
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).send("Youtube! >:v");
    }
    
    const agent = ytdl.createProxyAgent({ uri: myProxy });
    const { formats, videoDetails } = await ytdl.getInfo(videoUrl, { agent });

    const quality = ['360p', '480p'];
    let audioFormat = null;

    quality.some(qlv => {
      audioFormat = formats.find(f => f.mimeType?.includes("video/mp4") && f.qualityLabel === qlv && f.hasVideo && f.hasAudio);
      return audioFormat;
    });

    if (!audioFormat) {
      return res.status(400).send("Formato de audio no encontrado");
    }

    res.json(audioFormat);
    
  } catch (e) {
    res.json({ error: e.toString() });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
