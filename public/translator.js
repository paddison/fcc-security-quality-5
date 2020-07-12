import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const input = document.getElementById("text-input");
const translated = document.getElementById("translated-sentence");
const errorDiv = document.getElementById("error-msg");
const lan = document.getElementById("locale-select");
const translateBtn = document.getElementById("translate-btn");
const clearBtn = document.getElementById("clear-btn");
let str = "draper Like a high tech anti-clockwise draper. 0.30";
let transStr = str;

// add small sanitize function to escape <>
let sanitize = (str) => {
  return str.replace(/</g, "&lt").replace(/>/g, "&gt");
}
// declaring the handler functions

// function for translating from americanOnly, britishOnly, and amercian to british from americanToBritishSpelling Objects
let handleTranslateObjKeys = (obj, str) => {
  Object.keys(obj).forEach((key, index) => {
    
    let re = new RegExp("((?<=^|[^a-z])" + key + "(?=[^a-z]|$))", "ig");
    if (re.test(str)) {
      // error checking to avoid translating a word twice (chippy => fish-and-chip-shop, chip-shop => fish-and-chip-shop)
      if (str[str.indexOf(key) + key.length] === "<" || str[str.indexOf(key) + -1] === ">") {
        console.log("avoided double translation")
      }else {
      str = str.replace(re, "<span class='highlight'>" + obj[key] + "</span>");
      }
    }
  });
  return str;
};

// function for translating british to american from americanToBritishSpelling Object
let handleTranslateObjVal = (obj, str) => {
  Object.keys(obj).forEach((key, index) => {
    let re = new RegExp("(?<=^|[^a-z])" + obj[key] + "(?=[^a-z]|$)", "ig");
    if (re.test(str)) {
      // error checking to avoid translating a word twice (chippy => fish-and-chip-shop, chip-shop => fish-and-chip-shop)
      if (str[str.indexOf(obj[key]) + obj[key].length] === "<" || str[str.indexOf(obj[key]) + -1] === ">") {
        console.log("avoided double translation")
      }else {
      str = str.replace(re, "<span class='highlight'>" + key + "</span>");
      }
    }
  });

  return str;
};

// function to translate the titles
let handleTitles = (obj, str, lan) => {
  if (lan === "american-to-british") {
    Object.keys(obj).forEach((key, index) => {  
      let re = new RegExp("(?<=^|[^a-z])" + key + "(?=[^a-z]|$)", "ig");
      if (re.test(str)) {    
          // match the case of the title
          let matchArr = str.match(re);
          for (let i = 0; i < matchArr.length; i++) {
            str = str.replace(matchArr[i], "<span class='highlight'>" + matchArr[i].slice(0,-1) + "</span>");  
          }         
      }
    });
    return str;
  }else if (lan === "british-to-american") {
    Object.keys(obj).forEach((key, index) => { 
      let re = new RegExp("(?<=^|[^a-z])" + obj[key] + "(?=[^a-z]|$)", "ig");
      if (re.test(str)) {
        // match the case of the title
        let matchArr = str.match(re);
        for (let i = 0; i < matchArr.length; i++) {
          
          let caseRe = new RegExp(matchArr[i] + "(?=\\s|$)", "g");
          str = str.replace(caseRe, "<span class='highlight'>" + matchArr[i] + "." + "</span>");  
        }  
      }
    });
    return str;
  }
}

let handleTime = (str, lan) => {
  if (lan === "") {
    return false;
  }

  let find = ":";
  let replace = ".";
  let split = ":"

  if (lan === "british-to-american") {
    find = "\\.";
    replace = ":";
    split = "."
  }
  
  let re = new RegExp("\\d{1,2}" + find + "\\d{2}", "g"); //\d{1,2}.\d{2}/g;
  if (re.test(str)) {
    let matchArr = str.match(re);
    for (let val of matchArr) {
      str = str.replace(val, "<span class='highlight'>" + val.split(split).join(replace) + "</span>")
    }
  }
  return str
}

// if language is american:

let translateAmerican = (str, lan) => {
  str = handleTranslateObjKeys(americanOnly, str);
  str = handleTranslateObjKeys(americanToBritishSpelling, str);
  str = handleTitles(americanToBritishTitles, str, lan);
  str = handleTime(str, lan);

  return str;
}

// if language is british:

let translateBritish = (str, lan) => {
  str = handleTranslateObjKeys(britishOnly, str);
  str = handleTranslateObjVal(americanToBritishSpelling, str);
  str = handleTitles(americanToBritishTitles, str, lan);
  str = handleTime(str, lan);

  return str;
}

// put all it all in the translate function:

let translate = (str, lan) => {

  let returnStr;
  if (lan === "american-to-british") {
    returnStr = translateAmerican(str, lan);
  }else if (lan === "british-to-american") {
    returnStr = translateBritish(str, lan);
  }

  if (returnStr === str) {
    return "Everything looks good to me!";
  }else {
    return returnStr;
  }
}

let evalTranslation = (str, lan) => {
  if (str === "") {
    errorDiv.textContent = "Error: No text to translate.";
    translated.innerHTML = "";
  }else {
    translated.innerHTML = translate(str, lan);
    errorDiv.textContent = "";
  }
}

let clear = () => {
  input.value = "";
  errorDiv.textContent = "";
  translated.innerHTML = "";
}

translateBtn.addEventListener("click", () => {
  evalTranslation(sanitize(input.value), lan.value);
})

clearBtn.addEventListener("click", () => {
  clear();
})

try {
  module.exports = {
    handleTranslateObjKeys: handleTranslateObjKeys,
    handleTranslateObjVal: handleTranslateObjVal,
    handleTitles: handleTitles,
    handleTime: handleTime,
    translateAmerican: translateAmerican,
    translateBritish: translateBritish,
    translate: translate,
    evalTranslation: evalTranslation,
    clear: clear
  }
} catch (e) {}
