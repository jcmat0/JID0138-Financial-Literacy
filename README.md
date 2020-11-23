# JID0138-Financial-Literacy Delivery Documentation
# Release Notes

cents-of-unity v1.0
#### NEW FEATURES     
- Firebase Auth for Users
- Classes and Modules are creatable and editable
- User Profile has edit capabilities.
#### BUG FIXES     
- Fixed uid generation.
- Cleaned up datastore
- Login fail error case handled appropriately
#### KNOWN BUGS     
- API keys exposed
- Edit page is not formatted properly
- Phone number format not validated.

# Install Information
## Pre-requisites
- Have Node installed: https://nodejs.org/en/download/
When prompted, check the “install necessary tools” option and proceed. This will open a command prompt when installation is complete, which you will also need to proceed through.
- Get yarn following the instructions on
https://classic.yarnpkg.com/en/docs/install
  - Alternatively, since the instructions to install node also install chocolatey, you can open an elevated command prompt and run `$ choco install yarn` to install yarn.
## Dependent Libraries that must be installed
- This project has multiple dependencies that will be installed during the Run process.
## Download instructions
- Clone the repository by downloading and unzipping the file on https://github.com/jcmat0/JID0138-Financial-Literacy. Or use `$ git clone https://github.com/jcmat0/JID0138-Financial-Literacy.git` in a terminal/CMD.
## Run instructions
1. Navigate to the `cents-of-unity` folder within the repository in a Terminal/CMD
2. Run `$ yarn` to install the necessary dependencies and libraries.
3. After that command is done, run `$ yarn start`. This will open the project as a web page in your default web browser. If hosted on a web server, users will be able to access the project from your web server’s address.

## Troubleshooting
- Must be connected to the internet for every step of this process. If downloads or installs fail, be sure to check your internet connection.
- If `$ yarn` fails, delete the `node_modules/` folder and try again.
- When installing node with "necessary tools", the operation may take a long time, but that is normal. **Do not terminate the operation early.**
- If using chocolatey to install yarn, the output contains a lot of red text. This is normal.