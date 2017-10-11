#!/bin/bash

sqlite3 data_requests.db "create table requests( \
	id integer primary key, \
  name text, \
	date text, \
	data text, \
	bounds text, \
	email text
)"

chmod 777 data_requests.db #note that the dir that holds this file needs to be writable by others