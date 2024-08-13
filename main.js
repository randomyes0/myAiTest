const express = require('express');
const app = express();
const { G4F } = require("g4f");
const g4f = new G4F();
const port = process.env.PORT || 3000;

app.use(express.static('public')); // Mover esto antes de las rutas

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/aichat', async (req, res) => {
  const { apikey, entrada, rol } = req.query; // Usar req.query si los datos vienen de la URL

  if (!apikey || !entrada) {
    return res.status(400).json({ status: false, respuesta: "Faltan parámetros" });
  }

  if (apikey === "sicuani") {
    try {
      const messages = [
        { role: "system", content: rol },
        { role: "user", content: entrada }
      ];
      const rpt = await g4f.chatCompletion(messages);
      return res.json({ status: true, chat: entrada, respuesta: rpt });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, respuesta: "Error interno del servidor" });
    }
  } else {
    return res.json({ status: false, respuesta: "adios mundo xd" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
