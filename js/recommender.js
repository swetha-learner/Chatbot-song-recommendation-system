const LETTER_POOL = getEl('letter-pool'),
      TEMP_LETTER_POOL = getEl('temp-letter-pool'),
      LETTER_OVERLAY = getEl('letter-overlay'),
      CHAT_MESSAGE_COLUMN_WRAPPER = getEl('chat-message-column-wrapper'),
      CHAT_MESSAGE_COLUMN = getEl('chat-message-column'),
      MESSAGE_INPUT = getEl('message-input'),
      MESSAGE_INPUT_FIELD = getEl('message-input-field'),
      CHAT_BOT_MOOD = getEl('chat-bot-mood'),
      CHAT_BOT_MOOD_VALUE = getEl('chat-bot-mood-value')

const STATE = {
  isUserSendingMessage: false,
  isChatBotSendingMessage: false,
  letterPool: {
    transitionPeriod: 30000,
    intervals: []
  },
  moods: ['friendly', 'suspicious', 'boastful','love','sad','angry','happy','normal','recommend'],
  currentMood: '',
  chatbotMessageIndex: 0,
  nLetterSets: 4
}

const getRandMood = () => {
  const rand = getRand(1, 9)
  return STATE.moods[rand - 1]
}

const setChatbotMood = () => {
  STATE.currentMood = getRandMood()
  for(let i = 0; i < STATE.moods.length; i++){
    removeClass(CHAT_BOT_MOOD, STATE.moods[i])
  }
  addClass(CHAT_BOT_MOOD, STATE.currentMood)
  CHAT_BOT_MOOD_VALUE.innerHTML = STATE.currentMood
}

const getRandGreeting = () => {
  let rand = 0
  switch(STATE.currentMood){
    case 'friendly':
      rand = getRand(1, greetings.friendly.length)
      return greetings.friendly[rand - 1]
    case 'suspicious':
      rand = getRand(1, greetings.suspicious.length)
      return greetings.suspicious[rand - 1]
    case 'boastful':
      rand = getRand(1, greetings.boastful.length)
      return greetings.boastful[rand - 1]
    case 'love':
      rand = getRand(1, greetings.love.length)
      return greetings.love[rand - 1]
    case 'happy':
      rand = getRand(1, greetings.happy.length)
      return greetings.happy[rand - 1]
    case 'normal':
      rand = getRand(1, greetings.normal.length)
      return greetings.normal[rand - 1]
    case 'sad':
      rand = getRand(1, greetings.sad.length)
      return greetings.sad[rand - 1]
    case 'angry':
      rand = getRand(1, greetings.angry.length)
      return greetings.angry[rand - 1]
    case 'recommend':
      rand = getRand(1, greetings.recommend.length)
      return greetings.recommend[rand - 1]
    default:
      break
  }
}

const getRandConvo = () => {
  let rand = 0
  switch(STATE.currentMood){
    case 'friendly':
      rand = getRand(1, convo.friendly.length)
      return convo.friendly[rand - 1]
    case 'suspicious':
      rand = getRand(1, convo.suspicious.length)
      return convo.suspicious[rand - 1]
    case 'boastful':
      rand = getRand(1, convo.boastful.length)
      return convo.boastful[rand - 1]
    case 'love':
      rand = getRand(1, convo.love.length)
      return convo.love[rand - 1]
    case 'angry':
      rand = getRand(1, convo.angry.length)
      return convo.angry[rand - 1]
    case 'happy':
      rand = getRand(1, convo.happy.length)
      return convo.happy[rand - 1]
    case 'normal':
      rand = getRand(1, convo.normal.length)
      return convo.normal[rand - 1]  
    case 'sad':
      rand = getRand(1, convo.sad.length)
      return convo.sad[rand - 1]
    case 'recommend':
      rand = getRand(1, convo.recommend.length)
      return convo.recommend[rand - 1]
    default:
      break
  }
}

const createLetter = (cName, val) => {
  const letter = document.createElement('div')
  addClass(letter, cName)
  setAttr(letter, 'data-letter', val)
  letter.innerHTML = val
  return letter
}

const getAlphabet = isUpperCase => {
  let letters = []
  for(let i = 65; i <= 90; i++){
    let val = String.fromCharCode(i),
          letter = null
    if(!isUpperCase) val = val.toLowerCase()
    letter = createLetter('pool-letter', val)
    letters.push(letter)
  }
  return letters
}

const startNewLetterPath = (letter, nextRand, interval) => {
  clearInterval(interval)
  nextRand = getRandExcept(1, 4, nextRand)
  let nextPos = getRandPosOffScreen(nextRand),
          transitionPeriod = STATE.letterPool.transitionPeriod,
          delay = getRand(0, STATE.letterPool.transitionPeriod),
          transition = `left ${transitionPeriod}ms linear ${delay}ms, top ${transitionPeriod}ms linear ${delay}ms, opacity 0.5s`
  setElPos(letter, nextPos.x, nextPos.y)
  setStyle(letter, 'transition', transition)
  interval = setInterval(() => {
    startNewLetterPath(letter, nextRand, interval)
  }, STATE.letterPool.transitionPeriod + delay)
  STATE.letterPool.intervals.push(interval)
}

const setRandLetterPaths = letters => {
  for(let i = 0; i < letters.length; i++){
    let letter = letters[i],
          startRand = getRand(1, 4),
          nextRand = getRandExcept(1, 4, startRand),
          startPos = getRandPosOffScreen(startRand),
          nextPos = getRandPosOffScreen(nextRand),
          transitionPeriod = STATE.letterPool.transitionPeriod,
          delay = getRand(0, STATE.letterPool.transitionPeriod) * -1,
          transition = `left ${transitionPeriod}ms linear ${delay}ms, top ${transitionPeriod}ms linear ${delay}ms, opacity 0.5s`
          
    setElPos(letter, startPos.x, startPos.y)
    setStyle(letter, 'transition', transition)
    addClass(letter, 'invisible')
    LETTER_POOL.appendChild(letter)
    setTimeout(() => {
      setElPos(letter, nextPos.x, nextPos.y)
      removeClass(letter, 'invisible')
      let interval = setInterval(() => {
        startNewLetterPath(letter, nextRand, interval)
      }, STATE.letterPool.transitionPeriod + delay)
    }, 1)
  }
}

const fillLetterPool = (nSets = 1) => {
  for(let i = 0; i < nSets; i++){
    const lCaseLetters = getAlphabet(false),
          uCaseLetters = getAlphabet(true)
    setRandLetterPaths(lCaseLetters)
    setRandLetterPaths(uCaseLetters)
  }
}

const findMissingLetters = (letters, lCount, isUpperCase) => {
  let missingLetters = []
  for(let i = 65; i <= 90; i++){
    let val = isUpperCase ? String.fromCharCode(i) : String.fromCharCode(i).toLowerCase(),
        nLetter = letters.filter(letter => letter === val).length
    if(nLetter < lCount){
      let j = nLetter
      while(j < lCount){
        missingLetters.push(val)
        j++
      }
    }
  }
  return missingLetters
}

const replenishLetterPool = (nSets = 1) => {
  const poolLetters = LETTER_POOL.childNodes
  let charInd = 65,
      currentLetters = [],
      missingLetters = [],
      lettersToAdd = []
  
  for(let i = 0; i < poolLetters.length; i++){
    currentLetters.push(poolLetters[i].dataset.letter)
  }
  missingLetters = [...missingLetters, ...findMissingLetters(currentLetters, nSets, false)]
  missingLetters = [...missingLetters, ...findMissingLetters(currentLetters, nSets, true)]
  for(let i = 0; i < missingLetters.length; i++){
    const val = missingLetters[i]
    lettersToAdd.push(createLetter('pool-letter', val))
  }
  setRandLetterPaths(lettersToAdd)
}

const clearLetterPool = () => {
  removeAllChildren(LETTER_POOL)
}

const scrollToBottomOfMessages = () => {
  CHAT_MESSAGE_COLUMN_WRAPPER.scrollTop = CHAT_MESSAGE_COLUMN_WRAPPER.scrollHeight
}

const checkMessageColumnHeight = () => {
  if(CHAT_MESSAGE_COLUMN.clientHeight >= window.innerHeight){
    removeClass(CHAT_MESSAGE_COLUMN, 'static')
  }
  else{
    addClass(CHAT_MESSAGE_COLUMN, 'static')
  }
}

const appendContentText = (contentText, text) => {
  for(let i = 0; i < text.length; i++){
    const letter = document.createElement('span')
    letter.innerHTML = text[i]
    setAttr(letter, 'data-letter', text[i])
    contentText.appendChild(letter)
  }
}

const createChatMessage = (text, isReceived) => {
  let message = document.createElement('div'),
      profileIcon = document.createElement('div'),
      icon = document.createElement('i'),
      content = document.createElement('div'),
      contentText = document.createElement('h1'),
      direction = isReceived ? 'received' : 'sent'
  
  addClass(content, 'content')
  addClass(content, 'invisible')
  addClass(contentText, 'text')
  addClass(contentText, 'invisible')
  appendContentText(contentText, text)
  content.appendChild(contentText)
  
  addClass(profileIcon, 'profile-icon')
  addClass(profileIcon, 'invisible')
  profileIcon.appendChild(icon)
  
  addClass(message, 'message')
  addClass(message, direction)
  
  if(isReceived){
    addClass(icon, 'fab')
    addClass(icon, 'fa-cloudsmith')
    addClass(message, STATE.currentMood)
    message.appendChild(profileIcon)
    message.appendChild(content)
  }
  else{
    addClass(icon, 'far')
    addClass(icon, 'fa-user')
    message.appendChild(content)
    message.appendChild(profileIcon)
  }
  
  return message
}

const findLetterInPool = targetLetter => {
  let letters = LETTER_POOL.childNodes,
        foundLetter = null
  for(let i = 0; i < letters.length; i++){
    const nextLetter = letters[i]
    if(nextLetter.dataset.letter === targetLetter && !nextLetter.dataset.found){
      foundLetter = letters[i]
      setAttr(foundLetter, 'data-found', true)
      break
    }
  }
  return foundLetter
}

const createOverlayLetter = val => {
  const overlayLetter = document.createElement('span')
        addClass(overlayLetter, 'overlay-letter')
        addClass(overlayLetter, 'in-flight')
        overlayLetter.innerHTML = val
  return overlayLetter
}

const removePoolLetter = letter => {
  addClass(letter, 'invisible')
  setTimeout(() => {
    removeChild(LETTER_POOL, letter)
  }, 500)
}

const setElPosFromRight = (el, x, y) => {
  setStyle(el, 'right', x + 'px')
  setStyle(el, 'top', y + 'px')
}

const animateOverlayLetter = (letter, contentText, finalPos, isReceived) => {
  removePoolLetter(letter)
  const initPos = letter.getBoundingClientRect(),
        overlayLetter = createOverlayLetter(letter.dataset.letter)
  if(isReceived){
    setElPos(overlayLetter, initPos.left, initPos.top)
  }
  else{
    setElPosFromRight(overlayLetter, window.innerWidth - initPos.right, initPos.top)
  }
  LETTER_OVERLAY.appendChild(overlayLetter)
  setTimeout(() => {
    if(isReceived){
      setElPos(overlayLetter, finalPos.left, finalPos.top)
    }
    else{
      setElPosFromRight(overlayLetter, window.innerWidth - finalPos.right, finalPos.top)
    }
    setTimeout(() => {//asdf
      removeClass(contentText, 'invisible')
      addClass(overlayLetter, 'invisible')
      setTimeout(() => {
        removeChild(LETTER_OVERLAY, overlayLetter)
      }, 1000)
    }, 1500)
  }, 100)
}

const animateMessageLetters = (message, isReceived) => {
  const content = message.getElementsByClassName('content')[0],
        contentText = content.getElementsByClassName('text')[0],
        letters = contentText.childNodes,
        textPos = contentText.getBoundingClientRect()
  for(let i = 0; i < letters.length; i++){
    const letter = letters[i],
          targetLetter = findLetterInPool(letter.dataset.letter),
          finalPos = letter.getBoundingClientRect()
    if(targetLetter){
      animateOverlayLetter(targetLetter, contentText, finalPos, isReceived)
    }
    else{
      const tempLetter = createLetter('temp-letter', letter.dataset.letter),
            pos = getRandPosOffScreen()
      addClass(tempLetter, 'invisible')
      setElPos(tempLetter, pos.x, pos.y)
      TEMP_LETTER_POOL.appendChild(tempLetter)
      animateOverlayLetter(tempLetter, contentText, finalPos, isReceived)
      setTimeout(() => {
        removeChild(TEMP_LETTER_POOL, tempLetter)
      }, 100)
    }
  }
}

const addChatMessage = (text, isReceived) => {
  const message = createChatMessage(text, isReceived),
        content = message.getElementsByClassName('content')[0],
        contentText = content.getElementsByClassName('text')[0],
        profileIcon = message.getElementsByClassName('profile-icon')[0]
  CHAT_MESSAGE_COLUMN.appendChild(message)
  toggleInput()
  setTimeout(() => {
    removeClass(profileIcon, 'invisible')
    setTimeout(() => {
      removeClass(content, 'invisible')
      setTimeout(() => {
        animateMessageLetters(message, isReceived)
        setTimeout(() => replenishLetterPool(STATE.nLetterSets), 2500)
      }, 1000)
    }, 250)
  }, 250)
}

const checkIfInputFieldHasVal = () => MESSAGE_INPUT_FIELD.value.length > 0

const clearInputField = () => {
  MESSAGE_INPUT_FIELD.value = ''
}

const disableInputField = () => {
  MESSAGE_INPUT_FIELD.blur()
  MESSAGE_INPUT_FIELD.value = ''
  MESSAGE_INPUT_FIELD.readOnly = true
}

const enableInputField = () => {
  MESSAGE_INPUT_FIELD.readOnly = false
  MESSAGE_INPUT_FIELD.focus()
}

const getChatbotMessageText = () => {
  if(STATE.chatbotMessageIndex === 0){
    return getRandGreeting()
  }
  else{
    return getRandConvo()
  }
}

const sendChatbotMessage = () => {
  const text = getChatbotMessageText()
  STATE.isChatBotSendingMessage = true
  addChatMessage(text, true)
  STATE.chatbotMessageIndex++
  setTimeout(() => {
    STATE.isChatBotSendingMessage = false
    toggleInput()
  }, 4000)
}

const sendUserMessage = () => {
  const text = MESSAGE_INPUT_FIELD.value
  STATE.isUserSendingMessage = true
  addChatMessage(text, false)
  setTimeout(() => {
    STATE.isUserSendingMessage = false
    toggleInput()
  }, 4000)
}

const onEnterPress = e => {
  sendUserMessage()
  setTimeout(() => {
    sendChatbotMessage()
  }, 4000)
  toggleInput()
  clearInputField()
}

const initLetterPool = () => {
  clearLetterPool()
  fillLetterPool(STATE.nLetterSets)
}

const init = () => {
  setChatbotMood()
  initLetterPool()
  sendChatbotMessage()
  toggleInput()
  setMoodInterval(getRandMoodInterval())
}

let resetTimeout = null
const resetLetterPool = () => {
  const intervals = STATE.letterPool.intervals
  for(let i = 0; i < intervals.length; i++){
    clearInterval(intervals[i])
  }
  clearTimeout(resetTimeout)
  clearLetterPool()
  resetTimeout = setTimeout(() => {
    initLetterPool()
  }, 200)
}

const toggleInput = () => {
  if(checkIfInputFieldHasVal() && canSendMessage()){
    addClass(MESSAGE_INPUT, 'send-enabled')
  }
  else{
    removeClass(MESSAGE_INPUT, 'send-enabled')
  }
}

const isValidLetter = e => {
  return !e.ctrlKey 
    && e.key !== 'Enter'
    && e.keyCode !== 8
    && e.keyCode !== 9
    && e.keyCode !== 13
}

const canSendMessage = () => !STATE.isUserSendingMessage && !STATE.isChatBotSendingMessage

const getRandMoodInterval = () => getRand(20000, 40000)

let moodInterval = null
const setMoodInterval = time => {
  moodInterval = setInterval(() => {
    clearInterval(moodInterval)
    setChatbotMood()
    setMoodInterval(getRandMoodInterval())
  }, time)
}

MESSAGE_INPUT_FIELD.onkeypress = e => {
  if(checkIfInputFieldHasVal() && e.key === 'Enter'){
    removeClass(MESSAGE_INPUT, 'send-enabled')
    if(canSendMessage()){
      onEnterPress(e)
    }
  }
}

MESSAGE_INPUT_FIELD.onkeyup = () => {
  toggleInput()
}

MESSAGE_INPUT_FIELD.oncut = () => toggleInput()

window.onload = () => init()

window.onfocus = () => resetLetterPool()

window.onresize = _.throttle(resetLetterPool, 200)

const greetings = {
  friendly: [
    "Hi","hey","hola","heyo","hi buddy","hi dear","hi my love","hello","hello my love","hi buddy","hey there","whats up","hi bro","buddy","my meowiee","my meow","meow",
    "Good day to you, friend!","good morning","my friend","my love","hi there"
  ],
  suspicious: [
    "Hmm, I would introduce myself, but I'm not so sure thats a good idea.",
    "Hello, how are you? Wait, don't answer that, I have no way of verifying your response!",
    "i don't like you","hate you","hate","hate everything","why should i talk to you","who the hell are you"
  ],
  boastful: [
    "Good day to you. Though I must say that I am having a GREAT day!",
    "have a funfull day!","have a great day","have a good day ahead","happie day","happy day","good day"
  ],
  love: [
    "I love you","my love","love","love me like you do","love you to infinity and beyond","love me back",
    "i'm in love with you","what a lovely day","beautiful","lovely","cute","you're so cute","cute like me",
    "my cutie-pie","ishq","love me more","i love you more","will you marry me"
  ],
  
  sad: [
    "i'm sad today","i'm sad","sad here","feeling lonely","alone","smiling in pain","oh my god","sad like hell","emotionally tired"  
  ],
  
  angry: [
    "i'm angry on evrything","evrything makes me anger","angry on you","die","kill you","gonna kill you","i'm mad on you","mad","shame on you"
  ],
  happy: [
    "i'm happy to see you","you are my new friend","you are my world","your are my destiny","you're my evrything","i had a great day."
  ],
  normal: [
    "nothing much","what are you doing","whats up dude","normal me","gonna sleep","getting bored"
  ],
  recommend: [
    "song","name a song","suggest me a song","tell me a song","song for me","recommend","recommend me a song","song names for me","songs based on my mood",
    "suggest","tell", "sing a song","get me a song name", "songs to hear", "listen to music", "music for me"
  ]
}

const convo = {
  friendly: [
    "What a great thing you just said. I'm so glad you said it.",
    "Ahh, yes, I agree. It is so great to say things, isn't it?",
    "Please, tell me more. It brings me such joy to respond to the things you say.",
    "Ahh, yes valid point. Or was it? Either way, you're fantastic!",
    "Anyways, did I mention that I hope you're having a great day? If not, I hope it gets better!"
  ],
  suspicious: [
    "I just don't know if I can trust that thing you just said...",
    "Oh, interesting. I totally believe you. (Not really)",
    "Uh-huh, yeah, listen...I'm not going to fully invest in this conversation until I'm certain I know your motive.",
    "Wait, what the heck is that?? Oh, phewf, it's just another rogue letter 'R' that escaped the letter pool.",
    "You can't fool me, I know that's not true!","okay! i guess it's time for me to move here"
  ],
  boastful: [
    "That's interesting. I'll have you know that I am gratefull having a conversation with you.",
    "I feel like i got a new companion","thankyou my dear","That is great compliement i have ever received!","Thankyou for bringing instant blush in my face",
    "Thankyou! I'm really having a great time with you"
    "Oh, I forgot to mention that I've existed for over 100,000 seconds and that's something I'm quite proud of.",
    "Wow, thats pretty cool, but I can hold my breath for all of eternity. And it took me 0 seconds to gain that ability."
  ],
  love: [
    "Aww, I'm in cloud nine!","That's a great thing i have heared from you!","same here","Love you too","i'm a robot. are you okay with that?","good to hear this from you!","great feeling","nice to hear","thankyou! Love you too!"
  ],
  
  sad: [
    "oh no! I feel sorry for you!", "Sorry to hear this from you", "Be okay my dear!", "Don't worry.","No pain is permanent","listen to some music","relax yourself!"
  ],
  happy: [
    "i feel happy by seeing you're happy!","i'm glad that you are happy","Happy to see your smilng face","your smile make me happier too",
    "wishing you to hold this happiness forever","you're the reason of my hapiness too"
  ],
  angry: [
    "anger kills you slowly","don't get mad on things that makes you mad actually","chill dude","relax yourself","don't get anger",
    "anger punishes you for other's mistake","be calm","i would advise you to think on solution rather than thinking on what happend",
  ],
  normal: [
    "aww, your mood is normal just like mine","we are some what similar in handling emotions","happy to see you being normal without emotional fluctuations"
  ],
  recommend: [
    "idhazhin oru oram from "3" Movie", 
    "love me like you do by "Ellie goulding"",
    "POSITIONS by "Ariana Grande"",
    "Kadhal oru vizhiyil from "Kanchana 3" Movie",
    "I Like me better by "Lauv"",
    "Malai mangum neram from "Rowthiram" movie",
    "Heaven by "INNA"",
    "Mehabooba from "KGF 2"",
    "Closer by "THE Chain smokers"",
    "Harleys in Hawaii by "Katy perry"",
    "Pagal Iravai by "pranav das"",
    "Into your arms by "Ava Max"",
    "kaise hua from "Kabir Singh"",
    "Treat you better by "Shawn mendes""  
  ]
  
}