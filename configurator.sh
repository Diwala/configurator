#!/usr/bin/env bash
# Script to download configs using GitHub API v3.
# See: http://stackoverflow.com/a/35688093/55075

cat << "EOF"
  _____ _______          __     _                  _____ ____  _   _ ______ _____ _____ _    _ _____        _______ ____  _____
 |  __ |_   _\ \        / /\   | |        /\      / ____/ __ \| \ | |  ____|_   _/ ____| |  | |  __ \    /\|__   __/ __ \|  __ \
 | |  | || |  \ \  /\  / /  \  | |       /  \    | |   | |  | |  \| | |__    | || |  __| |  | | |__) |  /  \  | | | |  | | |__) |
 | |  | || |   \ \/  \/ / /\ \ | |      / /\ \   | |   | |  | | . ` |  __|   | || | |_ | |  | |  _  /  / /\ \ | | | |  | |  _  /
 | |__| _| |_   \  /\  / ____ \| |____ / ____ \  | |___| |__| | |\  | |     _| || |__| | |__| | | \ \ / ____ \| | | |__| | | \ \
 |_____|_____|   \/  \/_/    \_|______/_/    \_\  \_____\____/|_| \_|_|    |_____\_____|\____/|_|  \_/_/    \_|_|  \____/|_|  \_\


EOF

# Validate settings.
echo "Validating Github API token..."
[ -f .secrets ] && source .secrets
[ "$GITHUB_API_TOKEN" ] || { echo "Error: Please define GITHUB_API_TOKEN variable." >&2; exit 1; }
[ "$TRACE" ] && set -x

# Variables
GH_API="https://api.github.com"
REPO="$GH_API/repos/Diwala/config-cert-platform"
CONTENT="$REPO/contents"
CONFIG_NAME="config.json"
AUTH="Authorization: token $GITHUB_API_TOKEN"
UNAME=$(uname)

# Store config settings in variables concatenated with environment and platform
# Ex: SOURCE_FOR_FILE_A::DESTINATION_FOR_FILE_A,SOURCE_FOR_FILE_B::DESTINATION_FOR_FILE_B
CONFIG_SETTINGS__DEVWEB="$CONTENT/frontend/dev/config.json::client/,$CONTENT/backend/dev/config.json::src/"
CONFIG_SETTINGS__PRODWEB="$CONTENT/frontend/prod/config.json::client/,$CONTENT/backend/prod/config.json::src/"

# Methods
configure_configs()
{
  SETTING=$1
  echo "Starting to configure $PLATFORM configs for $ENVIRONMENT environment..."
  for i in $(echo $SETTING | sed "s/,/ /g")
  do
    CONFIG=$(echo $i | sed "s/::/,/g")
    IFS=, read -ra STRUCTURED_PATHS <<< "$CONFIG"

    echo "Downloading ${STRUCTURED_PATHS[0]} ..."
    curl -LJO# -H "Authorization: token $GITHUB_API_TOKEN" -H "Accept: application/vnd.github.v3.raw" -O -L ${STRUCTURED_PATHS[0]}

    echo "Moving the config into ${STRUCTURED_PATHS[1]} ..."
    mv $CONFIG_NAME ${STRUCTURED_PATHS[1]}/$CONFIG_NAME
  done
}

no_args()
{
  echo "$0: Environment and platform is required."
  echo "Usage: $0 -e <dev|prod> -p <web|mobile>"
  exit 4
}

configure_local()
{
  echo "Configuring config setup to use local environment..."
  echo "You can change default HOST URL for backend in src/config.json and for frontend in client/config.json."
  if [ $UNAME = Linux ]; then
    sed -i '/"HOST"/c\  \"HOST\": \"https:\/\/diwala.serveo.net\",' src/config.json
    sed -i '/"HOST"/c\  \"HOST\": \"http:\/\/localhost:5000\",' client/config.json
  else
    sed -i "" -E '/"HOST"\c; {\"HOST\": $\"https:\/\/diwala.serveo.net\"/,}' src/config.json/
    sed -i "" -E '/"HOST"\c; {\"HOST\": $\"http:\/\/localhost:5000\"/,}' client/config.json/
  fi
}

# handle non-option arguments
if [ $# -eq "0" ]; then
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

# Check dependencies.
set -e
type curl grep sed tr >&2
xargs=$(which gxargs || which xargs)

# Validate token.
curl -o /dev/null -sfH "$AUTH" $REPO || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Execute confugarator
CONFIG_SELECTOR=$(echo $ENVIRONMENT$PLATFORM | tr '[a-z]' '[A-Z]')
SELECTED_CONFIG=CONFIG_SETTINGS__${CONFIG_SELECTOR}

if [ "$CONFIG_SELECTOR" = LOCALWEB ]; then
  configure_configs $CONFIG_SETTINGS__DEVWEB
  configure_local
else
  configure_configs ${!SELECTED_CONFIG}
fi

echo "$0 done." >&2
