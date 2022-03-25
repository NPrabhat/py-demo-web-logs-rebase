import datetime
import socket
import os

def new_function(new_file_name):

    ts = datetime.datetime.now()
    home_dir = os.environ["HOME"]
    user = os.environ["USERNAME"]
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)

    with open(new_file_name, "w") as the_file:
        the_file.write("{}: {}@{} ip: {} home-dir: {}\n".format(ts, user, hostname, local_ip, home_dir))


if __name__ == "__main__":
    new_function("web-log.txt")
