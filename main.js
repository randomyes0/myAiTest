const express = require('express');

const { G4F } = require("g4f");

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
      const messages = [
        { role: "system", content: rol || "ai" },
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

app.use((req, res, next) => res.status(404).redirect('https://nekosmic.vercel.app/'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).redirect('https://nekosmic.vercel.app/');
});

app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
