#!/usr/bin/env bash
# Script to download configs using GitHub API v3.
# See: http://stackoverflow.com/a/35688093/55075

declare -A CONFIG_SETTINGS

# Variables
GH_API="https://api.github.com"
REPO="$GH_API/repos/Diwala/config-cert-platform"
CONTENT="$REPO/contents"
CONFIG_NAME="config.json"

# Store config settings in an associative array
# Ex: SOURCE_FOR_FILE_A::DESTINATION_FOR_FILE_A,SOURCE_FOR_FILE_B::DESTINATION_FOR_FILE_B
CONFIG_SETTINGS["DEVWEB"]="$CONTENT/frontend/config-dev.json::client/,$CONTENT/backend/config-dev.json::src/"
CONFIG_SETTINGS["PRODWEB"]='E:F,G:H'

# Methods
configure_configs() 
{
  SETTING=$1
  echo $SETTING
  for i in $(echo $SETTING | sed "s/,/ /g")
  do
    CONFIG=$(echo $i | sed "s/::/,/g")
    IFS=, read -ra STRUCTURED_PATHS <<< "$CONFIG"

    echo "Downloading ${STRUCTURED_PATHS[0]} ..."
    curl -LJO# -H "Authorization: token $GITHUB_API_TOKEN" -H "Accept: application/vnd.github.v3.raw" -O -L ${STRUCTURED_PATHS[0]}

    echo "Moving the config into ${STRUCTURED_PATHS[1]} ..."
    mv config-dev.json ${STRUCTURED_PATHS[1]}/config.dev.json
  done
}

no_args()
{
  echo "$0: Environment and platform is required."
  echo "Usage: $0 -e <dev|prod> -p <web|mobile>"
  exit 4
}

# handle non-option arguments
if [ $# -eq "0" ] 
  then
  no_args
fi

# Get arguments.
while [[ $# -gt 0 ]]
do
key="$1"
  case $key in
    -e|--environment)
    ENVIRONMENT="$2"
    shift # past argument
    shift # past value
    ;;
    -p|--platform)
    PLATFORM="$2"
    shift # past argument
    shift # past value
    ;;
    *)
    no_args
  esac
done

cat << "EOF"

  _____ _______          __     _                  _____ ____  _   _ ______ _____ _____ _    _ _____        _______ ____  _____  
 |  __ |_   _\ \        / /\   | |        /\      / ____/ __ \| \ | |  ____|_   _/ ____| |  | |  __ \    /\|__   __/ __ \|  __ \ 
 | |  | || |  \ \  /\  / /  \  | |       /  \    | |   | |  | |  \| | |__    | || |  __| |  | | |__) |  /  \  | | | |  | | |__) |
 | |  | || |   \ \/  \/ / /\ \ | |      / /\ \   | |   | |  | | . ` |  __|   | || | |_ | |  | |  _  /  / /\ \ | | | |  | |  _  / 
 | |__| _| |_   \  /\  / ____ \| |____ / ____ \  | |___| |__| | |\  | |     _| || |__| | |__| | | \ \ / ____ \| | | |__| | | \ \ 
 |_____|_____|   \/  \/_/    \_|______/_/    \_\  \_____\____/|_| \_|_|    |_____\_____|\____/|_|  \_/_/    \_|_|  \____/|_|  \_\
                                                                                                                                 
                                                                                                                                 
EOF

# Check dependencies.
set -e
type curl grep sed tr >&2
xargs=$(which gxargs || which xargs)

# Validate settings.
echo "Validating Github API token..."
[ -f .secrets ] && source .secrets
[ "$GITHUB_API_TOKEN" ] || { echo "Error: Please define GITHUB_API_TOKEN variable." >&2; exit 1; }
[ "$TRACE" ] && set -x

# Validate token.
curl -o /dev/null -sH "$AUTH" $REPO || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Execute confugarator
CONFIG_SELECTOR="$ENVIRONMENT$PLATFORM"
SELECTED_CONFIG=${CONFIG_SETTINGS[${CONFIG_SELECTOR^^}]}

echo "Starting to configure $PLATFORM configs for $ENVIRONMENT environment..."
configure_configs $SELECTED_CONFIG

echo "$0 done." >&2