# proyecto-ILDI
Este repositorio contiene el desarrollo del proyecto del curso Informática legal y derecho Informático,cuyos integrantes son: 
Antonio Rey Hermosilla
Byron Prado Lavin.

### Pasos para la Instalacion y descarga del proyecto
1. Ingresar por consola a una carpeta e ingresar "npx create-react-app <nombre>", donde <nombre> será la carpeta donde se guardará el proyecto.
2. Una vez se cree, ingresamos a la carpeta se debe copiar todo el contenido de este repositorio.
3. Ubicado dentro de la carpeta del proyecto y antes de ejecutar, se deben instalar unas dependencias:
   Para front y backend: "npm install axios express mongoose cors"
   Para el scraper: "pip install request beatifulsoup4 pdfplumber pymongo"

### Pasos para la ejecucion del proyecto
Debes seguir este orden para que funcione.
1. Necesitaremos una ventana de la consola para el modulo scrapper, 
ubicados en la carpeta src del proyecto escribimos en la consola: "python scraperDiario.py"

2. En otra ventana levantamos el server (backend),
ubicados en la raiz del proyecto escribimos en la consola: "node server.js"
3. Ahora en otra ventana ngresamos hasta la carpeta src, donde escribimos por consola : "npm start"

