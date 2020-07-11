/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Translator;
let evalTranslation;
let clear;
// to check if the color is right
let regex = /<span class="highlight">.+<\/span>/;
let translated;
let errorDiv;
let input;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
    evalTranslation = Translator.evalTranslation;
    clear = Translator.clear;
  });

  suite('Function evalTranslation(str, lan)', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      translated = document.getElementById("translated-sentence");
      evalTranslation("color", "american-to-british") 
      assert.equal(translated.textContent, "colour");
      assert.isTrue(regex.test(translated.innerHTML));
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      evalTranslation("colour", "american-to-british") 
      assert.equal(translated.textContent, "Everything looks good to me!");
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      errorDiv = document.getElementById("error-msg");
      evalTranslation("", "american-to-british");
      assert.equal(errorDiv.textContent, "Error: No text to translate.")
      done();
    });

  });

  suite('Function clear()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      errorDiv.textContent = "Error, error"; 
      translated.innerHTML = "Colour";
      input = document.getElementById("text-input");
      input.value = "Color";
      clear();
      assert.equal(errorDiv.textContent, "");
      assert.equal(translated.innerHTML, "");
      assert.equal(input.value, "");
      done();
    });

  });

});
