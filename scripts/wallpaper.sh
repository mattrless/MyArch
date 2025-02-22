#!/bin/bash

# Verificar si se proporciona el primer argumento (modo)
if [[ -z "$1" ]]; then
    echo "Usage: $0 <light|dark> [image_path]"
    exit 1
fi

# Guardar el argumento en una variable
MODE=$1

# Validar que el argumento sea "light" o "dark"
if [[ "$MODE" != "light" && "$MODE" != "dark" ]]; then
    echo "Invalid mode. Use 'light' or 'dark'."
    exit 1
fi

# Si se proporciona un segundo argumento, usarlo como la ruta de la imagen
if [[ -n "$2" ]]; then
    file="$2"
else
    # Seleccionar el archivo de imagen con yad si no se proporciona uno
    file=$(yad --file --filename="$HOME/Pictures/" --title="Select wallpaper" --mime-filter="image/*" --add-preview --large-preview)

    # Verificar si el usuario seleccionó una imagen
    if [[ $? -ne 0 ]]; then
        echo "canceled"
        exit 1
    fi
fi

# Ejecutar matugen con la ruta de la imagen seleccionada y verificar si se ejecuta correctamente
if matugen image "$file" -m "$MODE"; then
    echo "$file"  # Retorna la ruta del wallpaper
else
    echo "Error"
    exit 1
fi
