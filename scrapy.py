import requests
from bs4 import BeautifulSoup
import pdfplumber
import os
import re
from urllib.parse import urljoin
URL = "https://www.diariooficial.interior.gob.cl/edicionelectronica/empresas_cooperativas.php?date=08-11-2024&edition=43993"  # Ajusta según sea necesario

def scrapper(URL):
    # URL de la sección específica
    print(f"Accediendo a {URL}")
    pag_obtenido = requests.get(URL)
    html_obt = pag_obtenido.text
    soup = BeautifulSoup(html_obt, "html.parser")
    
    # Variables para almacenar el estado actual de sección y tipo
    seccion_actual = None
    tipo_actual = None
    empresas_datos = []

    # Encuentra todas las filas de la tabla
    tr_all = soup.find_all('tr')
    
    for fila in tr_all:
        # Verifica si la fila contiene una nueva sección
        seccion = fila.find('td', class_='title3')
        if seccion:
            seccion_actual = seccion.get_text(strip=True)
            continue  # Saltamos al siguiente `tr` después de actualizar la sección

        # Verifica si la fila contiene un nuevo tipo de empresa
        tipo = fila.find('td', class_='title5')
        if tipo:
            tipo_actual = tipo.get_text(strip=True)
            continue  # Saltamos al siguiente `tr` después de actualizar el tipo

        # Extrae el nombre de la empresa y el enlace al PDF en las filas con datos de empresa
        nombre_empresa = fila.find('td')
        enlace_pdf = fila.find('a', href=True)

        if nombre_empresa and enlace_pdf:
            nombre_empresa_texto = nombre_empresa.get_text(strip=True)
            enlace_pdf_url = urljoin(URL, enlace_pdf['href'])  # Construye la URL completa del PDF

            # Guarda la información de la empresa en una estructura organizada
            empresas_datos.append({
                'seccion': seccion_actual,
                'tipo': tipo_actual,
                'nombre_empresa': nombre_empresa_texto,
                'enlace_pdf': enlace_pdf_url
            })
    return empresas_datos

def print_data(empresa):
    print(f"Sección: {empresa['seccion']}")
    print(f"Tipo: {empresa['tipo']}")
    print(f"Empresa: {empresa['nombre_empresa']}")
    print(f"Enlace PDF: {empresa['enlace_pdf']}")

def extraer_informacion_pdf(enlace_pdf):
    # Descargar el archivo PDF desde el enlace
    print(enlace_pdf)
    respuesta = requests.get(enlace_pdf)
    nombre_pdf = "temp.pdf"
    
    # Guardar el PDF en un archivo temporal
    with open(nombre_pdf, "wb") as archivo_pdf:
        archivo_pdf.write(respuesta.content)
    
    # Abre el archivo PDF y extrae el texto
    with pdfplumber.open(nombre_pdf) as pdf:
        texto_extraido = ""
        
        # Itera a través de todas las páginas del PDF para extraer el contenido
        for pagina in pdf.pages:
            texto_extraido += pagina.extract_text()
    #print(texto_extraido)
    
    
    # Ejemplo de patrones de búsqueda (ajustar según la estructura de los PDF)
    # Estos patrones pueden ser, por ejemplo, nombres de campos específicos en el documento PDF.
    nombre_notario = re.search(r"EXTRACTO\n[\w]+[\s{1}\w}+]*", texto_extraido)
    nombre = re.sub(r"EXTRACTO\n", "", nombre_notario.group(0)) if nombre_notario else "No encontrado"
    CVE_obt = re.search(r"CVE\s[\d]*",texto_extraido)
    CVE = re.sub(r"CVE\s","",CVE_obt.group(0)) if CVE_obt else "no entonctrado"
    partes_involucradas = re.search(r"(don|doña)\s[\w\s]+",texto_extraido)

    print(nombre,CVE,partes_involucradas)


def main():
    a = 0
    b = 0
    empresas_datos= scrapper(URL)
        # Muestra los datos organizados
    for empresa in empresas_datos :
        if empresa['seccion'] == 'MODIFICACIÓN' and b < 2:
            print_data(empresa)
            print("-" * 30)

            b+=1
        elif empresa['seccion'] == 'CONSTITUCIÓN' and a <10:

            print_data(empresa)
            extraer_informacion_pdf(empresa['enlace_pdf'])
            print("-" * 30)
            a +=1


main()
