############################################################################################
# MOLECULER REPL CHEATSHEET
# http://moleculer.services/docs/moleculer-repl.html
#
# Version: 0.3.x
############################################################################################

############################################################################################
# Install Moleculer REPL
############################################################################################

npm i moleculer-repl

############################################################################################
# USAGE
############################################################################################

broker.repl();

############################################################################################
# COMMANDS
############################################################################################

help [command...]                               # Provides help for a given command.
exit                                            # Exits application.
q                                               # Exit application
call <actionName> [jsonParams]                  # Call an action
dcall <nodeID> <actionName> [jsonParams]        # Direct call an action
emit <eventName>                                # Emit an event
broadcast <eventName>                           # Broadcast an event
broadcastLocal <eventName>                      # Broadcast an event to local services
load <servicePath>                              # Load a service from file
loadFolder <serviceFolder> [fileMask]           # Load all service from folder
actions [options]                               # List of actions
events [options]                                # List of events
services [options]                              # List of services
nodes [options]                                 # List of nodes
info                                            # Information from broker

############################################################################################
# CALL SERVICE
############################################################################################

call "test.hello"

# Call with params
call "math.add" --a 5 --b Bob --c --no-d --e.f "hello"

# Call with JSON params
call "math.add" '{"a": 5, "b": "Bob", "c": true, "d": false, "e": { "f": "hello" } }'

############################################################################################
# EMIT EVENT
############################################################################################

emit "user.created"

# Emit with params
emit "user.created" --a 5 --b Bob --c --no-d --e.f "hello"

# Emit with JSON params
emit "user.created" '{"a": 5, "b": "Bob", "c": true, "d": false, "e": { "f": "hello" } }'
