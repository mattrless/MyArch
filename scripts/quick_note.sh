#!/bin/bash
# verifying if note content exists
if [ -z "$1" ]; then
    echo "Text not found."
    exit 1
fi

DEST_DIR="$HOME/Documents"
# verifying if docs directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo "Documents directory not found."
    exit 1
fi

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="note_$TIMESTAMP.txt"
# saving...
echo "$1" > "$DEST_DIR/$FILENAME"

echo "Note saved at /Documents/$FILENAME"