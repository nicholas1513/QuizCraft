# QuizCraft

An application that was pieced together quickly in order to work with multiple choice questions ripped from 
some PDF document while studying for CompTIA Security+.  

## REQUIREMENTS

1. Utilize a tool that has the ability to run through sets of multiple-choice questions, varying in size depending on how much time I had to study at a given moment.
2. Utilize a free tool. (<em>Costs were already getting pretty high between the exam voucher and textbooks.</em>)
3. Utilize a tool that would allow me to work with data stripped from a PDF. (<em>I didn’t want to bother with manually entering new questions later on.</em>)

The resources that I found online addressed a couple of these issues, but not all.  Most of them allowed for creating sets of digital flash cards based on two columns of data in an excel-like document.  However, I didn’t need flash cards.  Also, l would likely remember the answer to each card by its relative position to other choices.  I needed something that would mix up the choices.  

When I did find a tool that would allow me to run through sets of multiple-choice questions, it usually required a subscription fee, didn’t’ allow me to change the number of questions in a practice run, and required manual data entry.  Since I have run into this dilemma more than a couple of times, and it seemed relatively simple to other projects that I have worked on, I decided to build my own tool.  

## TOOLS / LANGUAGES:
* **ReactJS** : I decided to use ReactJS to standup a single page application with ease.  It was also fresh in my mind, since React w/Typescript was used in my last project.  
* **JSON** : I used JSON as data input for the application.  Each multiple-choice question is an object containing an attribute for a prompt, choices, answer, and original header.  The original header was used to test the function that mixed up the choices. I cross referenced the program’s determined correct choice (after mixing the choices up) with the correct choice from the original PDF source.
* **Electron** : I used Electron to package the whole application into a native app so that I would not need a keyboard to kick things off from my Surface Pro.  Instead, of interacting with the terminal, I simply clicked on the application icon with my stylus and began studying.
* **Python** : I used Python to strip text from a pdf containing a number of multiple-choice practice problems, organizing and storing the information as an object in a JSON file.

When the app starts up, you should choose one of the options from the menu on the left to determine quiz length (number of questions).  The submission button appears when all questions have been completely answered.  Selecting a quiz length from the menu will reset the quiz with the selected number of questions.  
