#!/bin/bash

# ==========================================
#      YAPE SERVER INSTALLER PRO v9
# ==========================================

# ===== VALIDAR UBUNTU =====
if [ -f /etc/os-release ]; then
    . /etc/os-release

    if [[ "$ID" != "ubuntu" ]]; then
        echo "❌ Este script solo funciona en Ubuntu."
        exit 1
    fi

    VERSION_OK=("18.04" "20.04" "22.04" "24.04")

    if [[ ! " ${VERSION_OK[@]} " =~ " ${VERSION_ID} " ]]; then
        echo "❌ Ubuntu $VERSION_ID no soportado."
        exit 1
    fi
else
    echo "❌ No se pudo detectar el sistema."
    exit 1
fi

# ===== VARIABLES =====
SCRIPT="/usr/local/bin/yape"
CONFIG="/etc/yape/config.conf"

REPO="https://github.com/kevinaldaircama/fake-yapeof"
RAW="https://raw.githubusercontent.com/kevinaldaircama/fake-yapeof/main/setup.sh"

mkdir -p /etc/yape

# ===== COLORES =====
verde="\e[32m"
rojo="\e[31m"
azul="\e[34m"
amarillo="\e[33m"
reset="\e[0m"

# ===== BANNER =====
banner() {
clear
echo -e "$azul"
echo "======================================================="
echo "           YAPE SERVER INSTALLER PRO v9"
echo "======================================================="
echo -e "$reset"
}

# ===== LOADING =====
loading() {

echo -ne "${verde}"

for i in {1..30}; do
    echo -ne "█"
    sleep 0.05
done

echo -e "${reset}"
}

# ===== VERIFICAR KEY =====
verificar_key(){

banner

echo "🔑 Ingresa tu Key"
echo ""
echo "Por defecto: kevintechtutorials"
echo ""

read -p "Key: " KEY

[ -z "$KEY" ] && KEY="kevintechtutorials"

echo ""
echo "🔄 Comprobando Key..."
loading

if [ "$KEY" != "kevintechtutorials" ]; then
    echo -e "${rojo}❌ Key incorrecta${reset}"
    exit 1
fi

echo -e "${verde}✅ Key válida${reset}"

sleep 1
}

# ===== GUARDAR CONFIG =====
guardar_config(){

mkdir -p /etc/yape

cat > "$CONFIG" <<EOF
DOMAIN=$DOMAIN
API_KEY=$API_KEY
AUTH_DOMAIN=$AUTH_DOMAIN
DATABASE_URL=$DATABASE_URL
PROJECT_ID=$PROJECT_ID
STORAGE_BUCKET=$STORAGE_BUCKET
MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
APP_ID=$APP_ID
EOF

}

# ===== CARGAR CONFIG =====
cargar_config(){

if [ -f "$CONFIG" ]; then
    source "$CONFIG"
fi

}

# ===== INSTALAR SCRIPT =====
instalar_script(){

cp "$0" "$SCRIPT"

chmod +x "$SCRIPT"

grep -qxF "alias menu='$SCRIPT'" ~/.bashrc || \
echo "alias menu='$SCRIPT'" >> ~/.bashrc

source ~/.bashrc

}
# ===== VALIDAR DOMINIO =====
validar_dominio(){

banner

echo "🌐 Ingresa tu dominio (ej: midominio.com)"
read -p "Dominio: " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${rojo}❌ Dominio vacío${reset}"
    exit 1
fi

echo ""
echo "🔍 Verificando dominio..."
loading

# prueba simple de resolución DNS
ping -c 1 "$DOMAIN" &>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${amarillo}⚠️ No se pudo verificar DNS, pero se continuará igual${reset}"
else
    echo -e "${verde}✔ Dominio responde correctamente${reset}"
fi

sleep 1
}

# ===== INSTALAR DEPENDENCIAS =====
instalar_dependencias(){

banner

echo "🚀 Instalando dependencias del servidor..."
loading

apt update -y
apt install -y nginx git curl zip unzip dnsutils certbot python3-certbot-nginx

systemctl enable nginx
systemctl start nginx

mkdir -p /var/www/html

echo -e "${verde}✔ Dependencias instaladas${reset}"
sleep 1
}

# ===== CLONAR REPOSITORIO =====
instalar_repo(){

banner

echo "📦 Descargando archivos del proyecto..."
loading

rm -rf /var/www/html/*
git clone "$REPO" /var/www/html

echo -e "${verde}✔ Repositorio instalado${reset}"
sleep 1
}

# ===== CONFIGURAR NGINX + SSL =====
configurar_nginx_ssl(){

banner

echo "🌍 Configurando servidor web..."

cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        return 301 https://$DOMAIN\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    root /var/www/html;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }
}
EOF

systemctl restart nginx

echo ""
echo "🔐 Generando SSL..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
--non-interactive --agree-tos -m admin@"$DOMAIN"

echo -e "${verde}✔ Nginx + SSL configurado${reset}"
sleep 1
}

# ===== INSTALACIÓN BASE =====
instalar_todo_base(){

verificar_key
validar_dominio
instalar_dependencias
instalar_repo
instalar_script
configurar_nginx_ssl

echo ""
echo -e "${verde}🎉 SERVIDOR LISTO COMPLETAMENTE${reset}"
sleep 2
menu
}

# ===== CONFIGURAR FIREBASE =====
configurar_firebase(){

banner

echo "🔥 CONFIGURACIÓN DE FIREBASE"
echo ""

read -p "API Key: " API_KEY
read -p "Auth Domain: " AUTH_DOMAIN
read -p "Database URL: " DATABASE_URL
read -p "Project ID: " PROJECT_ID
read -p "Storage Bucket: " STORAGE_BUCKET
read -p "Messaging Sender ID: " MESSAGING_SENDER_ID
read -p "App ID: " APP_ID

echo ""
echo "💾 Guardando configuración..."
loading

mkdir -p /var/www/html/app

cat > /var/www/html/app/firebase.js <<EOF
window.firebaseConfig = {
  apiKey: "$API_KEY",
  authDomain: "$AUTH_DOMAIN",
  databaseURL: "$DATABASE_URL",
  projectId: "$PROJECT_ID",
  storageBucket: "$STORAGE_BUCKET",
  messagingSenderId: "$MESSAGING_SENDER_ID",
  appId: "$APP_ID"
};
EOF

echo -e "${verde}✔ Firebase configurado${reset}"

sleep 1
}

# ===== GUARDAR CONFIG GLOBAL =====
guardar_config(){

mkdir -p /etc/yape

cat > "$CONFIG" <<EOF
DOMAIN=$DOMAIN
API_KEY=$API_KEY
AUTH_DOMAIN=$AUTH_DOMAIN
DATABASE_URL=$DATABASE_URL
PROJECT_ID=$PROJECT_ID
STORAGE_BUCKET=$STORAGE_BUCKET
MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
APP_ID=$APP_ID
EOF

echo -e "${verde}✔ Configuración global guardada${reset}"
}

# ===== CARGAR CONFIG =====
cargar_config(){

if [ -f "$CONFIG" ]; then
    source "$CONFIG"
fi

}

# ===== INSTALACIÓN COMPLETA FINAL =====
instalar_completo(){

instalar_todo_base
configurar_firebase
guardar_config

echo ""
echo -e "${verde}🎉 INSTALACIÓN FINALIZADA CON ÉXITO${reset}"
echo "👉 Usa: menu"
sleep 2

menu
}

# ===== MANTENER SERVIDOR ACTIVO =====
mantener_servidor(){

banner

echo "🟢 Verificando servidor..."

systemctl restart nginx

sleep 1

systemctl status nginx --no-pager

echo ""
echo "🔍 Comprobando dominio..."

ping -c 1 "$DOMAIN" &>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${verde}✔ Dominio activo${reset}"
else
    echo -e "${amarillo}⚠ Dominio no responde (puede ser DNS)${reset}"
fi

echo ""
echo -e "${verde}✔ Servidor activo${reset}"
sleep 2
menu
}

# ===== ACTUALIZAR SCRIPT INTELIGENTE =====
actualizar(){

banner

echo "🔄 ACTUALIZACIÓN DEL SISTEMA"
echo ""

echo "¿Cambió algún dato?"
echo "1) No (solo actualizar)"
echo "2) Sí (dominio o Firebase)"
echo ""

read -p "Opción: " op

if [ "$op" = "1" ]; then

    echo "⬇ Descargando actualización..."
    loading

    wget -q "$RAW" -O "$SCRIPT"
    chmod +x "$SCRIPT"

    echo -e "${verde}✔ Script actualizado sin cambiar configuración${reset}"
    sleep 2
    menu
    return
fi

if [ "$op" = "2" ]; then

    echo ""
    echo "¿Qué deseas cambiar?"
    echo "1) Dominio"
    echo "2) Firebase"
    echo "3) Ambos"

    read -p "Opción: " op2

    case $op2 in

    1)
        validar_dominio
        configurar_nginx_ssl
        ;;

    2)
        configurar_firebase
        guardar_config
        ;;

    3)
        validar_dominio
        configurar_nginx_ssl
        configurar_firebase
        guardar_config
        ;;

    *)
        echo "❌ Opción inválida"
        ;;
    esac

    echo ""
    echo "⬇ Actualizando script..."
    loading

    wget -q "$RAW" -O "$SCRIPT"
    chmod +x "$SCRIPT"

    echo -e "${verde}✔ Actualización completa${reset}"
    sleep 2
    menu
fi
}

# ===== DESINSTALAR SCRIPT =====
desinstalar(){

banner

echo "⚠️ ¿Seguro que deseas eliminar el sistema? (y/n)"
read -p ">> " resp

if [ "$resp" != "y" ]; then
    menu
    return
fi

rm -f "$SCRIPT"
rm -rf /etc/yape
sed -i '/alias menu/d' ~/.bashrc

echo ""
echo -e "${rojo}✔ Script eliminado completamente${reset}"

exit
}

# ===== MENÚ PRINCIPAL =====
menu(){

banner

echo "1) Mantener servidor activo"
echo "2) Actualizar script"
echo "3) Cambiar dominio"
echo "4) Cambiar Firebase"
echo "5) Desinstalar"
echo "6) Salir"
echo ""

read -p "Opción: " op

case $op in

1)
mantener_servidor
;;

2)
actualizar
;;

3)
validar_dominio
configurar_nginx_ssl
menu
;;

4)
configurar_firebase
guardar_config
menu
;;

5)
desinstalar
;;

6)
exit
;;

*)
echo "❌ Opción inválida"
menu
;;

esac
}

# ===== INICIO DEL SCRIPT =====
main(){

instalar_completo
menu
}

# ===== EJECUCIÓN =====
case "$1" in

--start)
menu
;;

--update)
actualizar
;;

*)
main
;;

esac
