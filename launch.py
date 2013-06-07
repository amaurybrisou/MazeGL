#!/usr/bin/env python3

import getopt, sys, os
from subprocess import call

def usage(prog_name):
	print(prog_name+" [-p,--port][PORT NUMBER] [-h,--help]")

def main():
	try:
		opts, args = getopt.getopt(sys.argv[1:], "hp:v", ["help", "port"])
	except getopt.GetoptError as err:
		print(err)
		usage(sys.argv[0])
		sys.exit(2)

	if(len(opts) == 0):
		usage(sys.argv[0]);
		sys.exit(2)

	port = 80
	verbose = False
	for o, a in opts:
		if o == "-v":
			verbose = True
		elif o in ("-h", "--help"):
			usage(sys.argv[0])
			sys.exit()
		elif o in ("-p", "--port"):
			port = a
		else:
			assert False, "unhandled option"

	if int(port) <= 1023 and os.getuid() != 0 :
		print("Launching HTTP Server on port "+str(port)+" need to be root")
	else :
		cur_dir = os.getcwd()
		call([ cur_dir+"/src/Server/init.js", str(port)])

if __name__ == "__main__":
		try:
			main()
		except KeyboardInterrupt:
			print("Servers Stopped")
