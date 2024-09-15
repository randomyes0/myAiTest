const express = require('express');
const app = express();
const ytdl = require("@distube/ytdl-core");
const { createCanvas, loadImage } = require('canvas');
const { G4F } = require("g4f");
const g4f = new G4F();
const { cookies } = require('./cookies.js'); //test
const { myProxy } = require('./proxy.js'); //test
const port = process.env.PORT || 3000;

app.use(express.static('public')); // Mover esto antes de las rutas

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/aichat', async (req, res) => {
  const { apikey, entrada, rol } = req.query; // Usar req.query si los datos vienen de la URL

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

app.get('/ttp', async (req, res) => {
  const text = req.query.text || 'Hello, World!'; 
  const canvasWidth = 800;
  const canvasHeight = 600;
  const backgroundColor = '#f0f0f0';

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  const backgroundImage = 'https://example.com/background-image.jpg';
  try {
    const img = await loadImage(backgroundImage);
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  } catch (error) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

  let fontSize = 80;
  ctx.font = `${fontSize}px 'Arial'`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  textGradient.addColorStop(0, '#ff0000');
  textGradient.addColorStop(1, '#0000ff');
  ctx.fillStyle = textGradient;

  let textWidth = ctx.measureText(text).width;
  while (textWidth > canvasWidth - 40) {
    fontSize--;
    ctx.font = `${fontSize}px 'Arial'`;
    textWidth = ctx.measureText(text).width;
  }

  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const buffer = canvas.toBuffer('image/png');
  const base64Image = buffer.toString('base64');

  res.send(base64Image);
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

    // Asegúrate de definir o eliminar `cookies` si no se necesita
    const agent = ytdl.createProxyAgent({ uri: myProxy });
    const { formats, videoDetails } = await ytdl.getInfo(videoUrl, { agent });

    const bitrates = [48, 64, 160];
    let audioFormat = null;

    bitrates.some(bitrate => {
      audioFormat = formats.find(f => f.mimeType?.includes("audio/webm") && f.audioBitrate === bitrate && f.hasAudio);
      return audioFormat; // `.some` devolverá `true` si se encuentra `audioFormat`
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

    // Asegúrate de definir o eliminar `cookies` si no se necesita
    const agent = ytdl.createProxyAgent({ uri: myProxy });
    const { formats, videoDetails } = await ytdl.getInfo(videoUrl, { agent });

    const quality = ['360p', '480p'];
    let audioFormat = null;

    quality.some(qlv => {
      audioFormat = formats.find(f => f.mimeType?.includes("video/mp4") && f.qualityLabel === qlv && f.hasVideo && f.hasAudio);
      return audioFormat; // `.some` devolverá `true` si se encuentra `audioFormat`
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
