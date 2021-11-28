
# Smart Class

A web application that gives students an array of digital academic and social tools to stay engaged with their studies, peers and broader university community during pandemic .


## Features

- Signin
- Signup
- Verification
- Class Request
- Assignment
- Practice Quiz
- Discussion Forum
- Logout




## Installation

Clone this repository to your desktop

Open visual studio and open this folder
```bash
  cd backend
  npm install
```
Again open visual studio open html folder inside the frontend folder of the Smart Class folder
Then go to signin.html file and click on Go Live from status bar

Now the frontend setup is ready

Now download pgadmin and make a database and give it name engage and restore the engage.sql file over there or click on tool option on menu bar and click on query tool option ,a window will be opened at right then run all engage.sql file queries over there 

After that run-    insert into admin(full_name,username,password) values('Admin_name','Admin_gmail_id','password');
Query in query tool section for inserting admin data because i haven't made signup feature for admin. Hence you can make anyone as admin.

Now you are done with backend setup

# Set the environment variables

Make an .env file in backend folder and add following variables

```PRIVATEKEY=Engage   
```
Assign any private key to it  but i gave it Engage(example)  

```
USER=postgres
```

User will remain same 

```
HOST=localhost
```
Host will also remain same

```
DATABASENAME=engage
```
give databasename over here as i wrote that you can make database with name engage so keep this same again or u can change database name at both the ends

```
DATABASEPASSWORD=
```
Assign Database password which you entered when you opened pgadmin and fill the password section

```
DATABASEPORT=5432
```
This will be the port which assigned to pgadmin while configuring it during installation

```
SMS_SECRET_KEY=fbe08ff65edb8503018a14a886d47dbeafa7194b8eb61a370ccad9390ebbcc3a974ab8979e62f79209dcf81412d76936d83eb01828dbef42ebd8d196e5b87549
```
Give your sms secret key or keep it as it is

```
PORT=4000
```
Give any other port or keep it as it is

```
GMAILID=
```
Give your gmail id over here for sending mails and then go to gmail less secure apps website and signin with your gmail which you  are assigning to it and then toggle Allow less secure apps button and make it on so that you can use nodemailer for sending mails easily

```
PASS=
```
Give password of the gmail account for GMAILID account to this variable


# USE WEB APPLICATION


Again go to terminal where you run npm install after running cd backend then run
```
npm start
```


Go to browser and use the website :)
