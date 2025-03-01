#!/bin/bash

# Verifica si se pasó un parámetro
if [ -z "$1" ]; then
  echo "Error: string missing."
  exit 1
fi

# Ruta al archivo, usando $HOME en lugar de ~
archivo="$HOME/.config/matugen/ags-astal-colors.scss"

# Verifica si el archivo existe
if [ ! -f "$archivo" ]; then
  echo "Error: File doesn't exist."
  exit 1
fi

# Reemplaza el contenido del archivo con el parámetro proporcionado
echo "$1" > "$archivo"