let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const label = document.querySelector('#label');
      console.log(label)
      label.addEventListener("keydown", function (e){
        if(e.code === "Enter"){
            getNotes(user.uid, label.value);
        }          
      })
    } 
    else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

function getNotes (userId, label) {
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (db) => {
        const data = db.val();
        if(label.length> 0){
            searchByLabel(data, label);
        }
        else{
            renderData(data);
        }
        
    })
}
function renderData(data){
    let html = '';
    for (const dataId in data){
        const note = data[dataId];
        const cardHtml = renderCard(note);
        console.log(cardHtml)
        html += cardHtml;
        console.log(html);
    }
    document.querySelector('#app').innerHTML = html;
}

function renderCard(note){;
    return `<div class = "column is-one-quarter">
            <div class = "card">
                <header class = "card-header">
                    <span class = "card-header-title"> ${ note.title }
                    </span>
                </header>
            </div>
            <div class = "card-content">
            <div class = "content"> ${ note.text }
            </div>
        </div>
        </div>`;
}
function searchByLabel(data, label){
    console.log(label)
    let cardsfound = 0;
    let html = '';
    for (const dataId in data){
        const note = data[dataId];
        if(note.label == label){
            const cardHtml = renderCard(note);
            html += cardHtml;
            cardsfound ++;
        }
        else{
            console.log(cardsfound);
            if(cardsfound < 1){
                html = 'sorry no cards found with this tag'
            }
        }
    }
    document.querySelector('#app').innerHTML = html;
}