eel.expose(renderQuestion);
function renderQuestion(question) {
    var chapter = JSON.parse(sessionStorage.getItem('currentChapter'));
    const questionChapter = document.getElementById('questionsChapter');
    questionChapter.innerHTML = "<h2>你正在練習第" + chapter + "章<h2>";
    const container = document.getElementById('questionsContainer');
    const question_str = `<h2>${question.question_number}</h2><p>${question.description}</p>`;
    const option_str = option_to_str(question);
    const explanation_str = explanation_to_str(question);
    container.innerHTML = question_str + option_str + explanation_str;
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the question data from session storage
    var questionData = JSON.parse(sessionStorage.getItem('currentQuestion'));
    if (questionData) {
        renderQuestion(questionData);
        setupOptionListeners(questionData);
    }
});

function jqSelectorEscape(selector) {
    return selector.replace(/(:|\.|\[|\]|,|=|@|\(|\))/g, "\\$1");
}

function explanation_to_str(question) {
    let str = `<div class="accordion" id="${question.question_number}_explanation" style="display:none;">
                <strong>
                    <p id="answer">Answer: ${question.answer}</p>
                    <span id="wrong_${question.question_number}" style="display:none; color: red;"> 錯了 (〒︿〒)，多練習 !</span>
                    <span id="success_${question.question_number}" style="display:none; color: green;"> 你好棒!~!d(\`･∀･)b</span>
                </strong>
                
                <div class="accordion-item mt-3">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne_${question.question_number}" aria-expanded="false" aria-controls="collapseOne">
                        答案說明
                        </button>
                    </h2>
                    <div id="collapseOne_${question.question_number}" class="accordion-collapse collapse" data-bs-parent="#${question.question_number}_explanation">
                        <div class="accordion-body">
                        ${question.explanation}
                        </div>
                    </div>
                </div>
            </div>`;
    return str;
}

function option_to_str(question){
    let str = "";
    const option_str = ["TRUE", "FALSE"];
    for (let index = 0; index < 2; index++) {
        const element = `<div class="form-check">
            <input class="form-check-input" type="radio" name="exampleRadios_${question.question_number}" id="${question.question_number}_${option_str[index]}" value="${option_str[index]}">
            <label class="form-check-label" for="${question.question_number}_${option_str[index]}">
                ${option_str[index]}
            </label>
        </div>`;
        str += element;
    }
    return str;
}

function loadBack() {
    // Store the question data and chapter number in session storage
    sessionStorage.removeItem('currentQuestion');
    sessionStorage.removeItem('currentChapter');
    sessionStorage.removeItem('currentType');
    window.location.href = 'main.html';
}

function setupOptionListeners(question) {
    const radios = $('.form-check-input'); // Use jQuery to select radios
    radios.click(function() { // Use jQuery `.click()` method
        const radio = $(this); // Current radio button
        const escapedId = jqSelectorEscape(`${question.question_number}_explanation`);
        const accordionDiv = $(`#${escapedId}`); // Select the accordion div using the escaped ID
        const answerDiv = accordionDiv.find('.accordion-button'); // Select only the button within this specific accordion
        const wrongMessage = $(`#${jqSelectorEscape('wrong_' + question.question_number)}`); // Ensure IDs are escaped
        const successMessage = $(`#${jqSelectorEscape('success_' + question.question_number)}`); // Ensure IDs are escaped
        console.log("答案", radio.val(), "選擇:", question.answer);
        if (radio.val() !== question.answer) {
            wrongMessage.show(); // Show the 'wrong' message
            successMessage.hide(); // Hide the 'success' message
            answerDiv.removeClass('bg-success-subtle').addClass('bg-danger-subtle');
            $('#answer').css('color', 'red'); // Set text color to red for the answer
        } else {
            successMessage.show(); // Show the 'success' message
            wrongMessage.hide(); // Hide the 'wrong' message
            answerDiv.removeClass('bg-danger-subtle').addClass('bg-success-subtle');
            $('#answer').css('color', 'green'); // Set text color to green for the answer
        }
        accordionDiv.show(); // Use jQuery `.show()` to make it visible
    });
}

async function checkAddList(questionData) {
    if ($("#flexCheckChecked_TF").prop("checked")) {
        const chapter = JSON.parse(sessionStorage.getItem('currentChapter'));
        const question = questionData.description;
        const question_number = questionData.question_number;
        const answer = questionData.answer;
        const explanation = questionData.explanation;
        await eel.add_topic(chapter, question, question_number, answer, explanation)();
        console.log("Checked and added to review list");
    } else {
        console.log("Checkbox not checked");
    }
}

async function loadNewQuestion() {
    var questionData = JSON.parse(sessionStorage.getItem('currentQuestion'));
    console.log("currentQuestion");
    // Await the check and list addition based on the checkbox state
    await checkAddList(questionData);

    // Get new question data based on the chapter and type
    var chapter = JSON.parse(sessionStorage.getItem('currentChapter'));
    var type = JSON.parse(sessionStorage.getItem('currentType'));
    eel.get_random_question_from_chapter(chapter, type)(function(question) {
        console.log("Fetching new question from chapter");
        renderQuestion(question);
        setupOptionListeners(question);
        sessionStorage.setItem('currentQuestion', JSON.stringify(question))
    });
}
