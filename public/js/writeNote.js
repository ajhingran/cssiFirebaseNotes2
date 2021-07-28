let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

const handleNoteSubmit = () => {
  // 1. Capture the form data
  const noteTitle = document.querySelector('#noteTitle');
  const noteText = document.querySelector('#noteText');
  console.log(noteText.value);
const label = generateLabels(noteText.value);
  // 2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser.uid}`).push({
    title: noteTitle.value,
    text: noteText.value,
    label: label
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    noteTitle.value = "";
    noteText.value = "";
  });
}

function generateLabels(noteText){
    let labels;
    var politicalwords = ['president', 'republican', 'democrat', 'democratic'];
    var sportswords = ['football', 'soccer', 'hockey', 'basketball', 'baseball'];
    var ifpolitical = new RegExp(politicalwords.join('|')).test(noteText);
    var ifsports = new RegExp(sportswords.join('|')).test(noteText);
    if(ifpolitical){
        labels = 'political';
    }
    if(ifsports){
        labels = 'sports';
    }
    else{
        labels = 'general';
    }
    return labels;
}