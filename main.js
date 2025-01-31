/*
TESTED
*/

const express = require('express');

const axios = require('axios')

const { Hercai } = require("hercai")

const { G4F } = require("g4f");

const { Brainman } = require("brainman");

const herc = new Hercai(); 

const g4f = new G4F();

const ai = new Brainman();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("/", (req, res) => res.redirect('https://nekosmic.vercel.app/'));

app.get('/ai', async (req, res) => {
    const { apikey, entrada } = req.query;
  
    if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" });
  
    if (apikey === "sicuani") {
        try {
            const url = 'https://api.blackbox.ai/api/chat';
            const data = {
                messages: [
                    {
                        content: entrada,
                        role: "user"
                    }
                ],
                model: "deepseek-ai/DeepSeek-V3",
                max_tokens: "1024"
            };
    
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            res.json({ status: true, chat: entrada, respuesta: response.data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, respuesta: "Error interno del servidor " + error.toString() });
        }
    } else {
        return res.json({ status: false, respuesta: "adios mundo xd" });
    }
});

app.get('/aimg', async (req, res) => {
    const { apikey, entrada } = req.query;

    if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" });

    if (apikey === "sicuani") {
        try {
            const url = 'https://chat-gpt.pictures/api/generateImage';
            const data = {
                captionInput: entrada,
                captionModel: "default"
            };

            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data;

                res.redirect(result.imgs[0])
        } catch (error) {
            console.error(error);
            res.status(500).send("Ocurrió un error en la generación de la imagen. " + error.toString());
        }
    } else {
        return res.json({ status: false, respuesta: "adios mundo xd" });
    }
});

app.get('/braiman', async (req, res) => {
    const { apikey, entrada } = req.query;
  
    if (!apikey || !entrada) return res.status(400).json({ status: false, respuesta: "Faltan parámetros" })
  
    if (apikey === "sicuani") {
      try {
      	
      const response = await ai.chat({
        version: "v1",
        prompt: entrada,
    });
  
              res.json({ status: true, chat: entrada, respuesta: response });
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, respuesta: "Error interno del servidor "+error.toString() });
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
