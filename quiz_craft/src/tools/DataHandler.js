import jsonData from '../temp/problems/problemData.json';
import { cloneDeep } from 'lodash';

const loadData = () => cloneDeep(jsonData);
const _ = require("underscore")

export default class DataHandler {

    generateProblems = (numberOfQuestions=0) => {
        let data = loadData()
        let newProblemKeys = this.randomizeKeyOrder(Object.keys(data).length, numberOfQuestions)
        let newQuizProblems = this.getProblemsFromData(data, newProblemKeys)
        return newQuizProblems
    }

    randomizeKeyOrder = (range, numberOfQuestions) => {
        let keys = []
        for(let i=0;i<range;i++){
          keys.push(i)
        }
        let randomKeys = _.shuffle(keys).slice(0, numberOfQuestions)
        return randomKeys
    }

    getProblemsFromData = (data, keys) => {
        let newProblems = {}
        for(let i=0;i<keys.length;i++){
          newProblems[i] = data[keys[i]]
        }
        return newProblems
    }

    randomizeQuizChoices = (problems) => {
        let newProblems = problems
        
        
        for(let i=0;i<Object.keys(newProblems).length;i++){
          let a = newProblems[i]['answer']
          let b = newProblems[i]['choices']
          let aValue = []
    
          // Feed aValue the values each element of "a" represents (the values of "a" are indexes for b)
          for(let x=0;x<a.length;x++){
            aValue.push(b[a[x]])
          }
    
          let bNew = _.shuffle(b).slice(0, b.length)
          let aNew = []
    
          for(let y=0;y<bNew.length;y++){
            if(aValue.includes(bNew[y])){
              aNew.push(y)
            }
          }
          newProblems[i].answer = aNew
          newProblems[i].choices = bNew
        }
        return newProblems
      }

}
