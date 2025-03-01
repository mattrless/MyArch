#!/bin/bash

if [[ -z "$1" ]]; then
    echo "Error: Debes proporcionar la ruta de una imagen."
    exit 1
fi

# Extraer la carpeta contenedora
dir=$(dirname "$1")"/"

# Obtener una imagen aleatoria diferente a la proporcionada
file=$(find "$dir" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.bmp" \) | shuf -n 1)

# Verificar si se encontró una imagen y si es diferente a la original
while [[ -n "$file" && "$file" == "$1" ]]; do
    file=$(find "$dir" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.bmp" \) | shuf -n 1)
done

# Verificar si se obtuvo una imagen válida
if [[ -z "$file" ]]; then
    echo "Error: No se encontraron imágenes en la carpeta."
    exit 1
fi

# Ejecutar swww con la imagen seleccionada
swww img "$file" --transition-type grow --transition-pos top-right --transition-duration 2 --transition-fps 60

# Retornar la ruta del wallpaper usado
echo "$file"
