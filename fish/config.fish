if status is-interactive
    # Commands to run in interactive sessions can go here
end

# Greeting message
set fish_greeting ""

# Init starship
starship init fish | source

if test $TERM = "xterm-kitty"
    function ssh
        env TERM=xterm-256color ssh $argv
    end
end

