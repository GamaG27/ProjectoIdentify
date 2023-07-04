const form = document.querySelector('form');

// Function to retrieve the API URLs for a given name
const getApiUrls = (name) => {
  return [
    `https://api.nationalize.io?name=${name}`,
    `https://api.agify.io?name=${name}`,
    `https://api.genderize.io?name=${name}`,
  ];
};

const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

// Function to round a number to two decimal places and add a percentage sign
const roundMath = (number) => {
  const decimalPlaces = 2;
  const percentage = (number * 100).toFixed(decimalPlaces);
  const formattedPercentage =
    parseFloat(percentage) === parseInt(percentage)
      ? parseInt(percentage) + '%'
      : parseFloat(percentage) + '%';
  return formattedPercentage;
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    await checkStatus(response);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name');
  const apiUrls = getApiUrls(name);

  try {
    const centerDiv = document.querySelector('.center');
    centerDiv.innerHTML = '';

    const data = await Promise.all(apiUrls.map(fetchData));
    console.log(data);

    const actionButtons = document.getElementById('callToAction');

    resultSquares(data);
    insertButtons(actionButtons);
  } catch (error) {
    console.error(error);

    let errorMessages = `<p>${error.message}</p>`;
    showLoadingAnimation(false);

    document.querySelector('.error-messages').innerHTML = errorMessages;
    showErrorMessage(true);
  }
});

const resultSquares = (data) => {
  const responseNation = document.getElementById('resNation');
  const countryId = data[0].country[0].country_id;
  const probabilityNation = data[0].country[0].probability;

  responseNation.innerHTML = `
    <p>There is a <b>${roundMath(
      probabilityNation
    )}</b> probability that you are fro ${countryId} <br></p>
    <img src="https://flagsapi.com/${countryId}/flat/64.png" alt="The flag of ${countryId}">
  `;

  const responseAge = document.getElementById('resAge');
  const age = data[1].age;

  responseAge.innerHTML = `<p><b>${age}</b> years old</p>`;

  const responseGender = document.getElementById('resGender');
  const gender = data[2].gender;
  const probabilityGender = data[2].probability;

  responseGender.innerHTML = `
    <p>There is a <b>${roundMath(
      probabilityGender
    )}</b> probability that you are a biological <b>${gender}</b></p>
  `;
};

const showLoadingAnimation = (isLoading) => {
  const loadingScreen = document.querySelector('.loading');
  if (isLoading) {
    loadingScreen.classList.remove('hidden');
    stageContainer.classList.add('hidden');
  } else {
    loadingScreen.classList.add('hidden');
    stageContainer.classList.remove('hidden');
  }
};

const showErrorMessage = (isError) => {
  const loadingScreen = document.querySelector('.error');
  if (isError) {
    loadingScreen.classList.remove('hidden');
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
    tryAgainButton.textContent = 'Try Again';

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
