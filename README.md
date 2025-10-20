# LCA FINAL (Laboratorio de Creación Algorítmica / Lab of Algorithmic Creations)

[Español](#es)
[English](#en)



## ES

### Idea

[Ejemplo del recorrido del espacio con P5](https://editor.p5js.org/royeden/sketches/A13drz3pX)

### Streaming

Este proyecto está diseñado para streamear audio a través de una red local en sistemas Linux con el protocolo RTP (protocolo de tiempo real) por UDP y el protocolo WebRTC (Protocolo de conexión en tiempo real a través de la web) por TCP / Sockets.
A futuro se incluirá una guía de cómo utilizarse en Windows y MacOS.

### Requisitos / Dependencias

- [libopus](https://opus-codec.org/) (Codec Opus)
- Linux: [Pulseaudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) y la herramienta pulseaudio control (`pactl`).
- [ffmpeg](https://www.ffmpeg.org/)
- [mediamtx](https://mediamtx.org/)

### Ejecución

Aclaración: Va a ser necesario tener dos consolas de comando abiertas, ya sea con múltiples pestañas o ventanas.

1. Para comenzar, instale las dependencias y asegurese de tener el ejecutable de `mediamtx` disponible en su entorno global o arrástrelo a la carpeta de este proyecto.
2. Ejecute el comando para listar las fuentes de audio de su sistema
    ```bash
    pactl list sources short
    ```
    para obtener sus fuentes de sonido disponibles para streamear.
3. Compruebe que los puertos habilitados en la configuración `mediamtx.yml` estén disponibles para su uso.
4. Edite las variables y ejecute el archivo `ffmpeg-stream.sh` (recuerde darle permisos de ejecución) o ejecute el comando
    ```bash
    ffmpeg -f pulse -i $INPUT \
      -ac 2 -ar 48000 -application lowdelay -frame_duration 10 \
      -flags +global_header \
      -fflags nobuffer -probesize 64 -analyzeduration 0 \
      -vn \
      -c:a libopus -b:a 64k \
      -content_type audio/ogg \
      -f rtp rtp://127.0.0.1:$PUERTO/stream
    ```
    manualmente para comenzar a streamear audio al puerto específico con `ffmpeg`, reemplazando `$INPUT` y `$PUERTO` por sus respectivos valores.

    Para saber más sobre el comando, abra el archivo `ffmpeg-stream.sh` y lea los comentarios de cómo funciona.

    Ejecutar este comando comenzará un stream de audio con el codec opus (audio ogg) en el puerto específicado y le mostará en su consola una configuración de SDP, similar a la que puede encontrar en el archivo `stream.sdp`. Copie esa configuración y péguela al final del archivo `mediamtx.yml` en la configuración del path `stream` (y en `stream.sdp` u otro archivo si desea probar que su stream se está enviando correctamente)
    ```yml
    paths:
    # /stream
    stream:
      # Su dirección fuente
      source: udp+rtp://127.0.0.1:$PUERTO
      # SDP (Protocolo de descripción de sesión)
      rtpSDP: |
        v=0
        o=- 0 0 IN IP4 127.0.0.1
        s=No Name
        c=IN IP4 127.0.0.1
        t=0 0
        a=tool:libavformat 60.16.100
        m=audio $PUERTO RTP/AVP 97
        b=AS:64
        a=rtpmap:97 opus/48000/2
        a=fmtp:97 sprop-stereo=1
    ```
5. Ingrese a otra terminal y ejecute `mediamtx` (recuerde darle permisos de ejecución), pasándole la configuración de `mediamtx.yml`
    ```bash
    ./mediamtx mediamtx.yml
    ```
6. Corrobore que su audio funcione accediendo a la dirección `http://<su dirección IP o 127.0.0.1 si entra desde el mismo dispositivo que hace el stream>:<su puerto de stream configurado en mediamtx.yml>/stream`, por defecto esto va a ser:
    - [`http://127.0.0.1:8889/stream`](http://127.0.0.1:8889/stream) en su computadora de stream (cuidado con esto, ya que podría terminar monitoreando el mismo audio que está streameando y terminar en un loop de feedback).
    - `http://<IP_DEL_SERVIDOR>:8889/stream` en otro dispositivo (puede obtener la IP de la computadora en su configuración de la red Wi-Fi). Si por ejemplo su IP fuese `192.168.0.2`, sería `http://192.168.0.2:8889/stream`.

## EN

### Idea

[P5 Example of a walk through the space](https://editor.p5js.org/royeden/sketches/A13drz3pX)

### Streaming

This project is designed to stream audio through a local network on Linux with the RTP (Real Time Protocol) protocol via UDP and the WebRTC (Web Real Time Connection) protocol via TCP / Sockets.
In the future it will include a guide of how to use it on Windows and MacOS.

### Requirements / Dependencies

- [libopus](https://opus-codec.org/) (Opus Codec)
- Linux: [Pulseaudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) and the pulse audio control tool (`pactl`).
- [ffmpeg](https://www.ffmpeg.org/)
- [mediamtx](https://mediamtx.org/)

### Execution

Note: It will be necessary to have two command lines open, either on múltiple tabs or windows.

1. To start, install the dependencies and ensure you have the executable `mediamtx` available on your global path or drag and drop it onto this project's folder.
2. Execute the command to list your system's audio sources
    ```bash
    pactl list sources short
    ```
    to get your available audio sources to stream.
3. Ensure that the ports configured in `mediamtx.yml` are available to use.
4. Edit the variables and execute the script `ffmpeg-stream.sh` (remember to give it execution permissions) o execute the command
    ```bash
    ffmpeg -f pulse -i $INPUT \
      -ac 2 -ar 48000 -application lowdelay -frame_duration 10 \
      -flags +global_header \
      -fflags nobuffer -probesize 64 -analyzeduration 0 \
      -vn \
      -c:a libopus -b:a 64k \
      -content_type audio/ogg \
      -f rtp rtp://127.0.0.1:$PORT/stream
    ```
    manually to start streaming audio at the specified port with `ffmpeg`, replacing `$INPUT` and `$PORT` with their respective values.

    To find out more about this command, open the file `ffmpeg-stream.sh` and read the comments on how it works.

    Executing this command will start an audio stream with the Opus codec (ogg audio) on the specified port and will show you an SDP configuration on your console, similar to the one you can find in the file `stream.sdp`. Copy this configuration and paste it at the end of your `mediamtx.yml` file, inside the `stream` path configuration (and in `stream.sdp` or another file if you want to probe your stream to validate it's being sent correctly)
    ```yml
    paths:
    # /stream
    stream:
      # Your local address
      source: udp+rtp://127.0.0.1:$PORT
      # SDP (Session Description Protocol)
      rtpSDP: |
        v=0
        o=- 0 0 IN IP4 127.0.0.1
        s=No Name
        c=IN IP4 127.0.0.1
        t=0 0
        a=tool:libavformat 60.16.100
        m=audio $PORT RTP/AVP 97
        b=AS:64
        a=rtpmap:97 opus/48000/2
        a=fmtp:97 sprop-stereo=1
    ```
5. Log into another terminal and execute `mediamtx` (remember to give it execution permissions), passing down the configuration in `mediamtx.yml`
    ```bash
    ./mediamtx mediamtx.yml
    ```
6. Corroborate that your audio is working by accessing the address `http://<your IP address or 127.0.0.1 if your accesing from your local device that's streaming>:<the stream port configured in mediamtx.yml>/stream`, by default these will be:
    - [`http://127.0.0.1:8889/stream`](http://127.0.0.1:8889/stream) on your streaming computer (careful with this, you could end up monitoring the same audio you are streaming and end up on a feedback loop).
    - `http://<SERVER_IP>:8889/stream` on another device (you can get the IP from the computer that's streaming by entering the Wi-Fi network configuration). For example, if your IP was `192.168.0.2`, it would be `http://192.168.0.2:8889/stream`.
