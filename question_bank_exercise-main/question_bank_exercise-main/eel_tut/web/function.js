// This script will be called when the confirm button is clicked
 document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmButton').addEventListener('click', function() {
        var chapter = document.getElementById('chapterSelect').value;
        var type = document.getElementById('QuestionSelect').value;
        console.log("Check",type,chapter);
        $('#NeedToSelect').hide();
        if(type =="題型" || chapter == "章節"){
            $('#NeedToSelect').show();
        }else{
            eel.get_random_question_from_chapter(chapter,type)(displayQuestion);
        }
    });
});
// This function receives the random question and redirects to QuestionPage.html
function displayQuestion(questionData) {
    var chapter = document.getElementById('chapterSelect').value;
    var type = document.getElementById('QuestionSelect').value;
    if(type =="題型" || chapter == "章節"){
        $('#NeedToSelect').show();
    } else {
        
        console.log("Check",type,chapter);
        // Store the question data and chapter number in session storage
        sessionStorage.setItem('currentQuestion', JSON.stringify(questionData));
        var chapter = document.getElementById('chapterSelect').value;
        sessionStorage.setItem('currentChapter', JSON.stringify(chapter));
        var TypeSelect = document.getElementById('QuestionSelect').value
        sessionStorage.setItem('currentType', JSON.stringify(TypeSelect));
        // Redirect to QuestionPage.html
        if(TypeSelect == 'MultiSelect'){
            window.location.href = 'QuestionPage.html';
        }else{
            window.location.href = 'TrueOrFalsePage.html';
        }
    }
    
}
    