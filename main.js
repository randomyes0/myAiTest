const express = require('express');
const app = express();
const ytdl = require("@distube/ytdl-core");
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { G4F } = require("g4f");
const g4f = new G4F();
const { cookies } = require('./cookies.js'); //test
const { myProxy } = require('./proxy.js'); //test
const port = process.env.PORT || 3000;

app.use(express.static('public')); // Mover esto antes de las rutas

app.get('/', (req, res) => {
  res.send('¡Hola, mundo XD!');
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

app.get('/giftext', async (req, res) => {
  try {
    const width = 200;
    const height = 200;
    const duration = 6; 
    const fps = 5; 
    const totalFrames = duration * fps;

    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    
    const inputText = req.query.text || 'ABC'; // Por defecto 'ABC' si no se proporciona texto

    
    encoder.start();
    encoder.setRepeat(0); 
    encoder.setDelay(100); 
    encoder.setQuality(10); 

    
    function randomNeonColor() {
        const colors = ['#ff073a', '#39ff14', '#fffc33', '#ff66cc', '#00ccff', '#ccff00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    
    for (let i = 0; i < totalFrames; i++) {
        ctx.fillStyle = 'black'; 
        ctx.fillRect(0, 0, width, height);

        
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = randomNeonColor();
        
        
        const randomChar = inputText.charAt(i % inputText.length); 
        ctx.fillText(randomChar, 75, 125);

        
        encoder.addFrame(ctx);
    }

    encoder.finish();

    
    const gifBuffer = encoder.out.getData();

    
    const gifBase64 = gifBuffer.toString('base64');
    res.send(gifBase64); 
  } catch (e) {
res.send(e)
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
