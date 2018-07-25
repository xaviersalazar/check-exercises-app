# contributors guide

All pull requests are welcome but they will have to be reviewed and approved first before merging to avoid more bugs or accidental merging. Please only work on one issue at a time until complete 

If you find a bug or have a more efficient way to do something, open an issue and I will get back to you on it thru the comments. If it's a major change to the program, like a new feature or a styling change, you can open an issue as well, but add `[feat]` or `[style change]` to your title with a description of what you want to change or add

Most of the code is location in the `assets` folder. There you'll find the css and js files you mostly be working with

# steps
### fork
Fork this repo by clicking the `Fork` button at the top right corner. 
This will create a fork of my repo in your own github. This will be your working copy 

### clone
Next you have to clone the repo. You do can do so by clicking the `Clone or Download` button, on your forked repo and click the copy icon to copy the URL. Open a terminal and run the following command: 

	git clone url-you-just-copied

For example

* SSH:

		git clone git@github.com:your-username-here/check-exercises-app.git

* HTTPS:

		git clone https://github.com/your-username-here/check-exercises-app.git
		
where `your-username-here` is your github username

### npm & packages installation
**This application requires npm. If you don't have npm, go [here](https://www.npmjs.com/get-npm) to install*

After you've cloned the repo, open the terminal and changed your directory into the cloned folder:

	cd path/to/folder/check-exercises-app

where `path/to/folder` is where you cloned the repo. For example, if you cloned the repo in your IdeaProjects folder, the command would look like:

	cd ~/IdeaProjects/check-exercises-app
	
You then need to install npm within the directory with the command:

	npm install
	
This will also install Electron since it is listed as a dependency

### create a branch
You should now open the project in your IDE. If you have access to the terminal through your IDE, you can use that since you'll be in the project folder already, or if you've followed the steps above you should be in the folder as well

You then need to create a branch to work on, since you will not be working in the master. You can do this with the following command:

	git checkout -b your-branch-name
	
where `your-branch-name` is the name of the branch you want to create. It's recommended your branch name mirrors the issue your working on

### starting electron
After you've created your branch you want to make sure electron is up and running. Within the root of your project, you can start the application by running the command:

    npm start
    
This will launch the application within Electron. This is how you will test the app and ensure your changes are working as expected

### make changes, commit and push
After you make the necessary changes that resolved the issue, you need to add and commit the changes. You can do so with the command:

	git add .

to add everything or

	git add file-name

with `file-name` being the name of file(s) you changed

Now commit the changes with the command:

	git commit -m 'a message about what you did'
	
You finally need to push your branch:

	git push origin your-branch-name
	
### submit for review
Goto your forked repo on Github. There you will see a `Compare and pull request` button. Click that to start a pull request. Then you can add a description of your pull request and any changes you may want to mention, then click the `Create Pull Request` button. After creating the pull request, you will need a code review before you can merge to the master. This is just to ensure that your pull request can be tested and the issue you are resolving is working as expected. If it doesnt work correctly, a `Request for Changes` will be made so you can correct them. If it does work correctly, your pull request will then be approved and merged into the master. And that's it! You've successfully contributed!