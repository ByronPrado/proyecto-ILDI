import requests
from bs4 import BeautifulSoup
import pdfplumber
import os
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
    print("-" * 30)

def main():
    empresas_datos= scrapper(URL)
        # Muestra los datos organizados
    for empresa in empresas_datos:
        if empresa['seccion'] == 'MODIFICACIÓN':
            print_data(empresa)        

main()
