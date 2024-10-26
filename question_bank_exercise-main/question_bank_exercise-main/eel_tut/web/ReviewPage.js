// ReviewPage.js
document.addEventListener('DOMContentLoaded', function() {
    loadReviewList();
});

async function loadReviewList() {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    const topics = await eel.get_topics()();
    topics.forEach(topic => {
        let options = "";
        if (topic[6]) {
            const parsedOptions = JSON.parse(topic[6]);
            options = Object.entries(parsedOptions).filter(([key, value]) => key !== topic[4]).map(([key, value]) => `<strong>${key}:</strong> ${value}`).join('<br>');
        }
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>第${topic[1]}章, 第${topic[3]}題</strong><br>
                    問題: ${topic[2]}<br>
                    答案: ${topic[4]}<br>
                </div>
                <button class="btn btn-danger" onclick="deleteTopic(${topic[0]})">刪除</button>
            </div>

            <div class="accordion mt-3" id="accordion_${topic[3]}">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed bg-success-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExplanation_${topic[3]}" aria-expanded="false" aria-controls="collapseExplanation_${topic[3]}">
                            答案說明
                        </button>
                    </h2>
                    <div id="collapseExplanation_${topic[3]}" class="accordion-collapse collapse" data-bs-parent="#accordion_${topic[3]}">
                        <div class="accordion-body">
                            ${topic[5]}
                        </div>
                    </div>
                </div>
                ${options ? `
                <div class="accordion-item mt-3">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed bg-primary-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOptions_${topic[3]}" aria-expanded="false" aria-controls="collapseOptions_${topic[3]}">
                            其他選項
                        </button>
                    </h2>
                    <div id="collapseOptions_${topic[3]}" class="accordion-collapse collapse" data-bs-parent="#accordion_${topic[3]}">
                        <div class="accordion-body">
                            ${options}
                        </div>
                    </div>
                </div>` : ""}
            </div>
        `;
        reviewList.appendChild(li);
    });
}

async function deleteTopic(topicId) {
    await eel.delete_topic(topicId)();
    loadReviewList();
}

function loadMainPage() {
    window.location.href = 'main.html';
}
