import jsonData from '../temp/problems/problemData.json';
import { cloneDeep } from 'lodash';

const loadData = () => cloneDeep(jsonData);
const _ = require("underscore")

export default class DataHandler {

    generateProblems = (numberOfQuestions=0) => {
        let newQuizProblems = {}
        let data = loadData()
        let newProblemKeys = this.randomizeKeyOrder(Object.keys(data).length, numberOfQuestions)
        
        for(let i = 0 ;i < newProblemKeys.length; i++){
            newQuizProblems[i] = data[newProblemKeys[i]]
        }

        return newQuizProblems
    }

    randomizeKeyOrder = (range, numberOfQuestions) => {
        let keys = []
        for(let i=0;i<range;i++){
            // create an array of integers within the provided range (totaling number of problems in the data source)
            keys.push(i)
        }
        // mix up the order and take only as many as defined by the quiz settings, "numberOfQuestions"
        let randomKeys = _.shuffle(keys).slice(0, numberOfQuestions) 

        return randomKeys
    }

    randomizeQuizChoices = (problems) => {
        let newProblems = problems
        
        for(let i=0;i<Object.keys(newProblems).length;i++){
          // For each problem, create a copy of the choices and answer property
          let answer = newProblems[i]['answer']
          let choices = newProblems[i]['choices']
          // Will need to find the value associated with the index value(s) in the answer property
          let answerValues = []
    
          // Store the value of the "answer" property's contained index values to the "choices" property.
          for(let x=0;x<answer.length;x++){
            answerValues.push(choices[answer[x]])
          }

          // This shuffles the order of the choices.    
          let newChoices = _.shuffle(choices).slice(0, choices.length)
          let newAnswer = []
    
          // Iterate through each choice in the choices property
          for(let y=0;y<newChoices.length;y++){
            // If the current choice matches an answer value, the current iteration index is a new answer index
            if(answerValues.includes(newChoices[y])){
              newAnswer.push(y)
            }
          }

          // Set the "answer" and "choices" properties to these new values.
          newProblems[i].answer = newAnswer
          newProblems[i].choices = newChoices
        }
        return newProblems
      }

}
