if status is-interactive
    # Commands to run in interactive sessions can go here
end

# Greeting message
set fish_greeting ""

# Init starship
starship init fish | source
