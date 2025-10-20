#!/usr/bin/env bash

# Partially based on https://github.com/versatica/mediasoup-demo/blob/v3/broadcasters/ffmpeg.sh
# Parcialmente basado en https://github.com/versatica/mediasoup-demo/blob/v3/broadcasters/ffmpeg.sh

# This spells AUDIO in phone keyboard :)
# Esto deletrea AUDIO en el teclado del teléfono :)
PORT=28346

# Your system monitor device, you can get it by running pulse audio control:
# Tu dispositivo de monitoreo de audio, lo podes obtener corriendo pulse audio control:
# ```console
# pactl list sources short
# ```
INPUT="alsa_output.pci-0000_05_00.6.analog-stereo.monitor"

# Use microphone as input
# Usar micrófono como input
# INPUT="default"

# ffmpeg -f (format) pulse (pulseaudio) -i (input file / input) $INPUT
#   -ac (audio channels) 2 -ar (audio rate) 48000
#   -application (Opus Codec specific) lowdelay (prioritize speed of transfer)
#   -frame_duration (Opus Codec specific) 10 (10ms per frame, can be 5, 10, 15 or 20)
#   -flags +global_header (add the a global header for the stream instead of one per-packet)
#   -fflags (format flags) no_buffer (don't buffer audio, send latest stream instead)
#   -probesize 32 (the byte size of the stream information)
#   -analyzeduration 0 (microseconds to probe audio, disables probing)
#   -vn (no video / video none)
#   -c:a (audio codec library) libopus (Opus Codec)
#   -b:a (audio buffer) 64k (64kb)
#   -content_type (content type header) audio/ogg (.ogg format)
#   -f (format, but this is set for the output because of positioning of the argument)
#   rtp (real time protocol via UDP)
#   rtp://127.0.0.1:$PORT/stream (stream into the "localhost IP:PORT/stream" address)
# ffmpeg -f (formato) pulse (pulseaudio) -i (archivo de entrada / input) $INPUT
#   -ac (canales de audio) 2 -ar (frecuencia de audio digital) 48000
#   -application (específico para el Codec Opus) lowdelay (priorizar la velocidad de transferencia)
#   -frame_duration (específico para el Codec Opus) 10 (10ms por ventana, puede ser 5, 10, 15 ó 20)
#   -flags +global_header (agregar un encabezado global al stream en lugar de a cada paquete)
#   -fflags (flags de formato) no_buffer (no guarda un buffer de audio, manda lo último disponible directamente por stream)
#   -probesize 32 (el tamaño en bytes de la información del stream)
#   -analyzeduration 0 (microsegundos para el muestreo de audio, desabilita el muestreo)
#   -vn (sin video)
#   -c:a (librería del Codec de audio) libopus (Codec Opus)
#   -b:a (buffer de audio) 64k (64kb)
#   -content_type (encabezado del tipo de contenido) audio/ogg (formato .ogg)
#   -f (formato, pero este es el de salida por la posición del argumento)
#   rtp (protocolo de tiempo real via UDP)
#   rtp://127.0.0.1:$PORT/stream (envía el stream a la dirección "localhost IP:PORT/stream")
ffmpeg -f pulse -i $INPUT \
  -ac 2 -ar 48000 -application lowdelay -frame_duration 10 \
  -flags +global_header \
  -fflags nobuffer -probesize 64 -analyzeduration 0 \
  -vn \
  -c:a libopus -b:a 64k \
  -content_type audio/ogg \
  -f rtp rtp://127.0.0.1:$PORT/stream
