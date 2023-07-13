const form = document.querySelector('form');
const centerForm = document.querySelector('.form-container');

const getApiUrls = (name) => [
  `https://api.nationalize.io?name=${name}`,
  `https://api.agify.io?name=${name}`,
  `https://api.genderize.io?name=${name}`,
];

const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

const roundPercentage = (number) => {
  const decimalPlaces = 2;
  const percentage = (number * 100).toFixed(decimalPlaces);
  return parseFloat(percentage) + '%';
};

async function fetchData(url) {
  const response = await fetch(url);
  checkStatus(response);
  return await response.json();
}

const fetchAllData = async (name) => {
  const apiUrls = getApiUrls(name);
  return await Promise.all(apiUrls.map(fetchData));
};

const displayResults = (data) => {
  displayName(data[0]);
  displayNationality(data[0]);
  displayAge(data[1]);
  displayGender(data[2]);
};

const displayName = (nameData) => {
  const titleName = document.getElementById('titleName');
  const resName = nameData.name;

  titleName.textContent = resName;
};

const displayNationality = (nationData) => {
  const responseNation = document.getElementById('resNation');
  const countryId = nationData.country[0].country_id;
  const probabilityNation = nationData.country[0].probability;

  responseNation.innerHTML = `
    <p>There is a <b>${roundPercentage(
      probabilityNation
    )}</b> probability that you are from ${countryId}</p>
    <img src="https://flagsapi.com/${countryId}/flat/64.png" alt="The flag of ${countryId}">`;
};

const displayAge = (ageData) => {
  const responseAge = document.getElementById('resAge');
  const age = ageData.age;

  responseAge.innerHTML = `<p><b>${age}</b> years old</p>`;
};

const displayGender = (genderData) => {
  const responseGender = document.getElementById('resGender');
  const gender = genderData.gender;
  const probabilityGender = genderData.probability;

  responseGender.innerHTML = `
    <p>There is a <b>${roundPercentage(
      probabilityGender
    )}</b> probability that you are a biological <b>${gender}</b></p>
  `;
};

const showLoadingAnimation = (isLoading) => {
  const loadingScreen = document.querySelector('.loading');
  const resultDiv = document.querySelector('.result');
  if (isLoading) {
    loadingScreen.classList.remove('hidden');
    centerForm.classList.add('hidden');
  } else {
    loadingScreen.classList.add('hidden');
    resultDiv.classList.remove('hidden');
  }
};

const showErrorMessage = (isError) => {
  const loadingScreen = document.querySelector('.error');
  if (isError) {
    loadingScreen.classList.remove('hidden');
    centerForm.classList.add('hidden');
  } else {
    loadingScreen.classList.add('hidden');
  }
};

const insertButtons = (div) => {
  // Create the label element
  const label = document.createElement('label');
  label.textContent = 'Am I Right?';

  // Create the first button element
  const button1 = document.createElement('button');
  button1.textContent = 'Yes';

  // Create the second button element
  const button2 = document.createElement('button');
  button2.textContent = 'No';

  // Append the label and buttons to the div
  div.appendChild(label);
  div.appendChild(button1);
  div.appendChild(button2);

  // Add event listeners to the buttons
  button1.addEventListener('click', () => {
    // Hide everything inside the div
    div.innerHTML = '';

    // Create a new paragraph element with the "Yes" text
    const message = document.createElement('p');

    // Setting this css style solving problem with new line in textContent
    message.setAttribute('style', 'white-space: pre;');
    message.textContent =
      'If I know this information, imagine what other companies with more resources can know about you \r\n';
    message.textContent += 'Be careful with your information!';

    // Create a "Try Again" button
    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Another Name';

    // Add event listener to the "Try Again" button
    tryAgainButton.addEventListener('click', () => {
      location.reload();
    });

    // Append the message and "Try Again" button to the div
    div.appendChild(message);
    div.appendChild(tryAgainButton);
  });

  button2.addEventListener('click', () => {
    // Hide everything inside the div
    div.innerHTML = '';

    // Create a new paragraph element with the "No" text
    const message = document.createElement('p');

    // Setting this css style solving problem with new line in textContent
    message.setAttribute('style', 'white-space: pre;');
    message.textContent =
      'Congratulations! Its hard to know information about you. But beware!\r\n';
    message.textContent +=
      'Other companies with more resources may still find other details about you.\r\n';
    message.textContent += 'Be careful with your information!';

    // Create a "Try Again" button
    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Another Name';

    // Add event listener to the "Try Again" button
    tryAgainButton.addEventListener('click', () => {
      location.reload();
    });

    // Append the message and "Try Again" button to the div
    div.appendChild(message);
    div.appendChild(tryAgainButton);
  });
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name');

  try {
    showLoadingAnimation(true);
    const data = await fetchAllData(name);
    console.log(data);

    setTimeout(() => {
      showLoadingAnimation(false);
      displayResults(data);
      insertButtons(document.getElementById('callToAction'));
    }, 5000);
  } catch (error) {
    console.error(error);

    showLoadingAnimation(false);
    document.querySelector(
      '.error-messages'
    ).innerHTML = `<p>${error.message}</p>`;
    showErrorMessage(true);
  }
});
