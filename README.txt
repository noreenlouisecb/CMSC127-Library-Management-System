1. sudo -i -u postgres
2. psql
3. CREATE DATABASE lms;
4. CREATE USER lmsgrp3 WITH PASSWORD '127127';
5. GRANT ALL PRIVILEGES ON DATABASE lms to lmsgrp3;
6. \q
7. exit
8. psql -h 127.0.0.1 -U lmsgrp3 -W lms
9. \i (pathofsqlfile)/S2L_GROUP3_PSQL.sql
10.sudo apt-get install npm
11. Open terminal, go to directory (path of file)
12. nodejs index.js
13. Open browser, http://localhost:3000
/* NOTE:
	ADMIN ID = ADMIN
	ADMIN PASSWORD = ADMINPASS
*/

