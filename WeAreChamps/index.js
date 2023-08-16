// pre-setup (!) settings for Firebase Realtime DB
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL: "https://realtime-database-c4ecd-default-rtdb.europe-west1.firebasedatabase.app/",
};
// initialize connection to Firebase & databaseURL
const app = initializeApp(appSettings);
// establish entrypoint with Firebase DB & project
const database = getDatabase(app);
// create a reference to our DB storage location.
const messageLogInDB = ref(database, "messageLog");
let textAreaEl = document.querySelector("#textArea");
let publishMessageBtnEl = document.querySelector("#publishMessageBtn");
let chatMessagesEl = document.querySelector("#chatMessages");
// adding placeholder text for #textArea
textAreaEl.placeholder = "Write your endorsement here...";
// adding eventlistenr for button "Publish"
let warningMessageEl = document.querySelector("#warningMessage");
warningMessageEl.textContent = "Do not any text field empty!";

let inputFieldYourNicknameEl = document.querySelector("#inputFieldYourNickname");
inputFieldYourNicknameEl.placeholder = "Your Nickname...";

publishMessageBtnEl.addEventListener("click", function () {
	let inputValue = textAreaEl.value.trim();
	let inputFieldYourNicknameValue = inputFieldYourNicknameEl.value.trim();
	if (!inputValue || !inputFieldYourNicknameValue) {
		document.getElementById("warningMessage").style.display = "block";
		return; // Exit the function if the inputValue or nickname input is empty
	}
	document.getElementById("warningMessage").style.display = "none";
	let fullMessage = yourNicknameAndTitle(inputValue);
	// push is triggerng the onValue function()
	push(messageLogInDB, fullMessage);
	textAreaEl.value = "";
	inputFieldYourNicknameEl.value = "";
});

// lister for changes inside the DB location, trigger at changes, push function() or at refresh-page (JS is being loaded)
onValue(messageLogInDB, function (snapshot) {
	// if array (path of messageLogInDB )exist, run code, othewewise it doesnt exist, meaining list has been deleted
	if (snapshot.exists()) {
		const DBConvertedToArrayBySnapshot = Object.values(snapshot.val());

		// if parent element div #chatMessages has an element aka parent has a firstChild, as long as it has a firtChild, remove until none are left.
		while (chatMessagesEl.firstChild) {
			chatMessagesEl.removeChild(chatMessagesEl.firstChild);
		}
		// When list is empty, re-create the list (update the list)

		DBConvertedToArrayBySnapshot.forEach(function (currentElement) {
			constructUserMessagesFromTextArea(currentElement);
		});
	}
});

function constructUserMessagesFromTextArea(inputValue) {
	const parentDiv = document.querySelector("#chatMessages");
	const childElement = document.createElement("p");
	childElement.className = "appendedMessage";
	childElement.textContent = inputValue;
	parentDiv.appendChild(childElement);
}

function yourNicknameAndTitle(inputValue) {
	let selectYourTitleEl = document.querySelector("#selectYourTitle").selectedOptions[0].text;
	console.log(selectYourTitleEl);
	let inputFieldYourNicknameEl = document.querySelector("#inputFieldYourNickname").value.trim();
	// adding capitalize to the first letter of the user nickname
	inputFieldYourNicknameEl = capitalize(inputFieldYourNicknameEl);
	// To allow line-break we added whie-space: pre-line which allows line-break, in this case the "\n"
	return `${inputValue}\n${selectYourTitleEl} ${inputFieldYourNicknameEl}`;
}

function capitalize(input) {
	return input.charAt(0).toUpperCase() + input.slice(1);
}
