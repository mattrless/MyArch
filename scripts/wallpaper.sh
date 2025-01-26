#!/bin/bash

file=$(zenity --file-selection --filename $HOME/Pictures/)
#file=$(yad --file)

swww img $file --transition-fps 120 --transition-type wipe --transition-duration 2