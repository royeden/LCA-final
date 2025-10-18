#!/usr/bin/env bash

# test if the stream is running by probing with the `stream.sdp` (session description protocol)
# prueba si el stream está corriendo haciendo un muestreo con el `stream.sdp` (protocolo de descripción de sesión)
printf $(ss -aunp | grep 28346)
printf $(ffprobe -protocol_whitelist file,udp,rtp -i stream.sdp)
