# GoogleSheetsCMS
This readme file will walk you through forking and setting up the Google Scripts and Web Site Code to run a blogging CMS with a Google Sheets DB.

You can find the presentation version of our blogging CMS at https://stewartjohn.github.io/GoogleSheetsCMS/d19/.

To create your own copy of this project, follow the 10 step instructions listed below.

The first set of instructions will help you set up your Google Sheets.

1. Copy our [Google Sheets](https://docs.google.com/spreadsheets/d/1Lhov4PcoKWoEp1_68GIfSXCX3vNlAx2ykM_iTNF74Wc/copy).
2. Within the Google Sheets, go to Tools->Script Editor.
3. With the server.gs file selected (default), select the setup function from the Select Function drop down menu and hit play. You will need to authorize the scripts to run in your Google account.
4. Click on Publish->Deploy as web app.... The "current web app URL" is the URL for your blogging form.
5. Return to the Google Sheets, and select File->Publish to the web and then say start publishing.
6. Copy the Sheet ID for your sheet. This can be found in the URL for your sheet. Look for the long string of random characters where I have put the xxxxx's: https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxx/edit.

Now that your Google Sheet is set up, fork this GitHub repo to get your copy of the Website.
1. If you have a GitHub account, fork this repo. If you don't want an account, you can download this repo, and set it up in Reclaim Hosting or another web server.
2. In the d19 directory, open the response.html file and overwrite the sheetID in line 81 with your own Google Sheet ID (from step 6 above).
3. In the d19 directory, open the assets directory and then the js subdirectory. In the index.js file, overwrite the sheetID in line 33 with your own Google Sheet ID.
4. If you are working in GitHub, you can serve your website by going into settings and choose the master-branch of your repo as the source for your GitHub Pages. If you are working in Reclaim Hosting or another server, make sure you set up the files for your site in a publicly accessible domain, subdomain, or subdirectory.
