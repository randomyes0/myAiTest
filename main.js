const express = require('express');

const { Hercai } = require("hercai")

const { G4F } = require("g4f");

const herc = new Hercai(); 

const g4f = new G4F();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("/", (req, res) => res.redirect('https://nekosmic.vercel.app/'));

app.get('/aichat', async (req, res) => {
  const { apikey, entrada, rol } = req.query;

  if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" })

  if (apikey === "sicuani") {
    try {

        res.json({ status: true, chat: entrada, respuesta: "error", version: "v1" });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, respuesta: "Error interno del servidor "+error.toString() });
    }
  } else {
    return res.json({ status: false, respuesta: "adios mundo xd" });
  }
});

app.get('/chatgpt', async (req, res) => {
    const { apikey, entrada } = req.query;
  
    if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" })
  
    if (apikey === "sicuani") {
      try {
  
          herc.question({model:"v3",content: entrada}).then(response => {
              res.json({ status: true, chat: entrada, respuesta: response.reply });
          });
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, respuesta: "Error interno del servidor "+error.toString() });
      }
    } else {
      return res.json({ status: false, respuesta: "adios mundo xd" });
    }
  });

app.get('/genimg', async (req, res) => {
    const { apikey, entrada } = req.query;

    if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" })
    if (apikey === "sicuani") {

    try {

        herc.drawImage({
  model:"v3",
  prompt:entrada,
  negative_prompt: "",
  sampler: "DPM-Solver",
  image_style: "Null", //pixel
  width: 256,
  height: 256,
  steps: 10,
  scale: 5
            }).then((response) => {
            res.redirect(response.url);
            });
       
    } catch (error) {
        console.error(error);
        res.status(500).send("Ocurrió un error en la generación de la imagen.");
    }

    } else {
    return res.json({ status: false, respuesta: "adios mundo xd" });
  }
});

app.use((req, res, next) => res.status(404).redirect('https://nekosmic.vercel.app/'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).redirect('https://nekosmic.vercel.app/');
});

app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
