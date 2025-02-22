#!/bin/bash

# Seleccionar el archivo de imagen con yad
file=$(yad --file --filename="$HOME/Pictures/" --title="Select wallpaper" --mime-filter="image/*" --add-preview --large-preview)

# Verificar si el usuario seleccionó una imagen
if [[ $? -ne 0 ]]; then
    echo "canceled"
    exit 1
fi

# Ejecutar swww con la imagen seleccionada
swww img "$file" --transition-type grow --transition-pos top-right --transition-duration 2 --transition-fps 60

# Retornar la ruta del wallpaper
echo "$file"