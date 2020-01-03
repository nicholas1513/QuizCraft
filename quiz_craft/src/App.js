import React, { Component } from 'react';
import './App.css';
import { Affix, Layout, Card, Pagination, Row, Col, Checkbox, Radio, Button} from 'antd';
import SideMenu from './components/SideMenu'
import DataHandler from './tools/DataHandler'

const { Header, Content, Footer, Sider } = Layout;

const emptyProblem = {
  originalQuestionHeader: "",
  prompt: "",
  answer: [],
  choices: [],
  selectedChoices: []
}

const defaultQuizSettings = {
  numberOfQuestions: 0
}

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      score: 0,
      hideScore: true,
      hideSubmit: true,
      hidePages: true,
      initialized: false,
      collapsed: false,
      selectedChoices: [],
      quizSettings: defaultQuizSettings,
      currentQuizProblems: {},
      countCurrentQuizProblems: 0,
      currentProblem: emptyProblem
    }
  }

  initState = (settings=false) =>{
    let quizSettings = settings? settings: this.state.quizSettings

    let dataHandler = new DataHandler()
    let newQuizProblemData = dataHandler.generateProblems(this.state.quizSettings.numberOfQuestions)
    
    // Randomize choices for each problem in newQuizProblemData
    let newQuizProblems = dataHandler.randomizeQuizChoices(newQuizProblemData)

    let newCountCurrentQuizProblems = Object.keys(newQuizProblems).length
    this.setState({
      hideScore: true,
      hideSubmit: true,
      hidePages: false,
      initialized: true,
      collapsed: false,
      selectedChoices: [],
      quizSettings: quizSettings,
      currentQuizProblems: newQuizProblems,
      countCurrentQuizProblems: newCountCurrentQuizProblems,
      currentProblem: newQuizProblems[0]
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(!this.state.initialized){
      this.initState()
    }else{
      let quizSettings = this.state.quizSettings
      let settingsChanged = prevState.quizSettings!==quizSettings
      if( settingsChanged ){
        this.initState(quizSettings)
      }
    }
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  checkAnswersCompleted = () => {
    let currentQuizProblems = this.state.currentQuizProblems
    let allCompleted = false
    let complete = 0
    let incomplete = 0

    for(let i=0;i<Object.keys(currentQuizProblems).length;i++){
      let currentProblem = currentQuizProblems[i]
      let answerCount = currentProblem.answer.length
      let selectedChoicesCount = currentProblem.selectedChoices? currentProblem.selectedChoices.length: 0
      if (answerCount>0 && answerCount===selectedChoicesCount){
        complete+=1
      }else{
        incomplete+=1
      }
    }
    if(incomplete===0 && (complete===Object.keys(currentQuizProblems).length)){
      allCompleted = true
    }

    return allCompleted
  }

  selectionHandler = (event) => {
    let {currentProblem, selectedChoices} = this.state
    let isCheckbox = Array.isArray(event)
    let currentSelection = []

    // Selection is handled differently depending on type of choice element (checkbox or radio)
    if(isCheckbox){
      currentSelection = event
    }else{
      currentSelection = [event.target.value]
    }
    
    // If the user is returning to a question, and hasnt selected anything new, the choices they 
    //   selected earlier will be selected.  This would not require the state to be updated.
    // However, if the user just made a new selection, or de-selection, the state needs to be 
    //   updated to reflect the new set of selected choices for that problem.
    if(selectedChoices !== currentSelection){
      currentProblem["selectedChoices"] = currentSelection
      let answersCompleted = this.checkAnswersCompleted()
      let hideSubmit = answersCompleted? false: true

      this.setState({
        selectedChoices: currentSelection,
        hideSubmit: hideSubmit
      })
    }
  }

  changePage = (page) => {
    let currentQuizProblems = this.state.currentQuizProblems
    let oldProblem = this.state.currentProblem
    let currentProblem = currentQuizProblems[page-1]
    if(currentQuizProblems && currentProblem){
      let problemPageMismatch = currentProblem !== oldProblem

      if(problemPageMismatch){
        let selectedChoices = currentProblem.selectedChoices
        this.setState({
          currentProblem: currentProblem,
          selectedChoices: selectedChoices
        })
      }
    }
  }

  isSelected = (key) => {
    let selected = false
    const selectedChoices = this.state.currentProblem.selectedChoices
    if(selectedChoices && selectedChoices.includes(key)){
      selected = true
    }
    return selected
  }

  choiceSelection = () =>{
    let { currentProblem } = this.state
    let framedChoices = ""
    if(!currentProblem){
      return framedChoices
    }

    // Retrieve and store the needed properties from the currentProblem object.
    const answer = currentProblem.hasOwnProperty('answer')? currentProblem.answer: [];
    const choices = currentProblem.hasOwnProperty('choices')? currentProblem.choices: [];
    let selected = currentProblem.hasOwnProperty('selectedChoices')? currentProblem.selectedChoices: [];
    let choiceSelection = ""

    // Classname Used to show incorrect/correct answers on submit.
    choiceSelection = choices.map((choice, index) => {
      let newClassName = "problem-choices"
      if(this.state.hideScore===false && selected){
        if(answer.includes(index)){
          newClassName = "problem-choices correct"
        }else if(selected.includes(index)){
          newClassName = "problem-choices incorrect"
        }
      }
      
      // Determine type of choice based on number of elements/choices in the answer (checkbox or radio)
      let formattedChoice = () => {
        if(answer.length > 1){
          return <Checkbox className={newClassName}  key={index} value={index}>{choice}</Checkbox>
        }else{
          return <Radio className={newClassName}  key={index} value={index}>{choice}</Radio>
        }
      }

      return formattedChoice()
    })

    // Determine type of choice grouping based on number of elements/choices in the answer.
    if(answer.length > 1){
      framedChoices = (
        <Checkbox.Group className="problem-choice-group" style={{ width: '100%' }} 
          key={currentProblem.originalQuestionHeader} defaultValue={selected} onChange={(e) => this.selectionHandler(e)}
          >
            <Row style={{width: '100%'}}>{choiceSelection}</Row>
        </Checkbox.Group>
      )
    }else{
      framedChoices = (
        <Radio.Group className="problem-choice-group" style={{ width: '100%' }} 
          key={currentProblem.originalQuestionHeader} onChange={(e) => this.selectionHandler(e)} 
          defaultValue={this.state.currentProblem.selectedChoices? this.state.currentProblem.selectedChoices[0]:undefined}
          >
            <Row style={{width: '100%'}}>{choiceSelection}</Row>
        </Radio.Group>
      )
    }

    return framedChoices
  }

  promptArea = () => {
    let prompt = this.state.currentProblem? this.state.currentProblem.prompt: "";
    return (
      <h3 className="prompt-text" >{prompt}</h3>
    )
  }

  changeNumberofQuestions = (e) => {
    //get the value of the item in the submenu
    let value = e.item.props.value
    let quizSettings = this.state.quizSettings
    this.setState({
      quizSettings:{
        ...quizSettings,
        numberOfQuestions: value
      }
    })
  }

  areArraysEqual = (arr1,arr2) => {
    let result = false
    // If one of the two arrays are empty, return.
    if(!arr1  || !arr2)
      return result;
    arr1.forEach((e1,i)=>arr2.forEach(e2=>{
      if(e1.length > 1 && e2.length){
          result = this.areArraysEqual(e1,e2);
      }else if(e1 !== e2 ){
          return result
      }else{
          result = true
      }

      // If result is false at this point, a mismatch exists. No need 
      // to continue evaluating. 
      if(result === false){
        return result
      }
    })
   )
   return result
  }

  calculateScore = () => {
    let currentQuizProblems = this.state.currentQuizProblems
    let score = 0

    for(let i=0;i<Object.keys(currentQuizProblems).length;i++){
      let currentProblem = currentQuizProblems[i]
      if(currentProblem.hasOwnProperty('selectedChoices')){
        let selectedChoices = currentProblem.selectedChoices
        let answer = currentProblem.answer
        
        answer.sort()
        selectedChoices.sort()
        if(this.areArraysEqual(answer, selectedChoices)){
          score+=1
        }
        this.setState({
          score:score,
          hideScore:false
        })
      }else{
        console.log('Missing user selection during answer comparison.')
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <SideMenu updateQCount={(e) =>this.changeNumberofQuestions(e)} collapsed={this.state.collapsed}/>
          </Sider>
          <Layout>
            <Affix offsetTop={this.state.top}>
              <Header style={{ background: '#c9c9c9'}} >
                  <Row hidden={this.state.hidePages} style={{justifyContent: 'center', alignItems: 'center', display:'inline-flex'}}>
                    <Col span={24}>
                      <Pagination simple 
                        defaultCurrent={1} 
                        defaultPageSize={1} 
                        total={this.state.countCurrentQuizProblems} 
                        onChange={this.changePage}/>
                    </Col>
                    <Col offset={2}>
                      <Button onClick={()=> this.calculateScore()} hidden={this.state.hideSubmit} >Submit</Button>
                    </Col>
                  </Row>
                </Header>
            </Affix>
            <Row>
              <Col hidden={this.state.hideScore}>
                <h2>SCORE : {(this.state.score/this.state.countCurrentQuizProblems)*100}% | {this.state.score}/{this.state.countCurrentQuizProblems}</h2>
              </Col>
            </Row>
            <Content style={{ margin: '0 16px', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Row>
                  <Col span={24} >
                    <Card title={this.promptArea()} bordered={false} >
                      {this.choiceSelection()}
                    </Card>
                  </Col>
                </Row>
            </Content>
            <Footer style={{ background: '#c9c9c9', textAlign: 'center' }}>Quiz Creator</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
