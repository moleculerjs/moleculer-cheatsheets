############################################################################################
# MOLECULER CLI CHEATSHEET
# http://moleculer.services/docs/moleculer-cli.html
#
# Version: 0.4.x
############################################################################################

############################################################################################
# Install Moleculer CLI
############################################################################################

npm i -g moleculer-cli

############################################################################################
# INIT NEW PROJECT
############################################################################################

# Create a new project from "project-simple" template to "my-project" folder
moleculer init project-simple my-project

# Create a new project from "my-template" template Github repo to "my-project" folder
moleculer init icebob/my-template my-project

# Create a new project from local template to "my-project" folder
moleculer init ./path/to-custom-template my-project

############################################################################################
# START LOCAL BROKER
############################################################################################

moleculer start

############################################################################################
# START BROKER AND CONNECT TO TRANSPORTER
############################################################################################

# Connect to local NATS (default)
moleculer connect
# or
moleculer connect nats://localhost:4222

# Connect to Redis
moleculer connect redis://localhost

# Connect to MQTT
moleculer connect mqtt://localhost

# Connect to AMQP
moleculer connect amqp://localhost:5672

# Connect with options
moleculer connect --ns dev --id node-22 --metrics --hot --cb --serializer Avro nats://localhost:4222

# --ns           Namespace                                [string] [default: ""]
# --id           NodeID                                 [string] [default: null]
# --metrics, -m  Enable metrics                       [boolean] [default: false]
# --hot, -h      Enable hot-reload                    [boolean] [default: false]
# --cb           Enable circuit breaker               [boolean] [default: false]
# --serializer   Serializer                             [string] [default: null]
