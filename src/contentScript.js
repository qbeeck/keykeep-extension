function addEmailInputButton() {
  const emailInputs = document.querySelectorAll('input[type="email"]');
  const passwordInputs = document.querySelectorAll('input[type="password"]');

  [...emailInputs, ...passwordInputs].forEach(function(input) {
    var button = document.createElement('button');
    button.innerText = 'key'; // Set button text
    button.type = "button";

    // Style the button
    button.style.cursor = 'pointer';
    button.style.marginInlineEnd = '5px';

    // Append the button after the input element
    input.parentNode.appendChild(button);

    // Add event listener to the button
    button.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: 'getPasswords',
        data: {
          domain: window.location.hostname,
        },
      },
      function(response) {
        showDropdown(response, button, input);
      });
    });
  });
}

function updateInput(input, value) {
  input.value = value;

  // Triggering 'input' event
  var event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);

  // Triggering 'change' event
  var event = new Event('change', { bubbles: true });
  input.dispatchEvent(event);
}

function showDropdown(data, button, input) {
  // Create dropdown element
  var dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');

  // Create dropdown content
  var dropdownContent = document.createElement('div');

  dropdownContent.style.fontSize = '20px';
  dropdownContent.style.background = '#3f51b5';
  dropdownContent.style.color = 'white';
  dropdownContent.style.padding = '10px 5px';
  dropdownContent.style.borderRadius = '10px';


  dropdownContent.classList.add('dropdown-content');

  // Populate dropdown with data from response
  data.forEach(function(item) {
    var option = document.createElement('div');
    option.style.cursor = 'pointer';
    option.style.margin = '5px 0';

    option.addEventListener('mouseover', function() {
      // Add styles when the item is hovered
      option.style.backgroundColor = 'lightblue';
      option.style.color = 'white';
    });

    // Add event listener for mouseout
    option.addEventListener('mouseout', function() {
      // Remove styles when the mouse moves away from the item
      option.style.backgroundColor = '';
      option.style.color = '';
    });

    option.innerText = item.title; // Assuming 'name' is a property in each object of the response array

    // Add click event listener to each dropdown option
    option.addEventListener('click', function() {
      if (input.type === 'email') {
        updateInput(input, item.username);
      } else {
        updateInput(input, item.password);
      }

      dropdown.remove();
    });

    dropdownContent.appendChild(option);
  });

  // Append dropdown content to dropdown
  dropdown.appendChild(dropdownContent);

  // Position dropdown relative to the button
  var rect = button.getBoundingClientRect();
  dropdown.style.position = 'absolute';
  dropdown.style.top = (rect.top + rect.height) + 'px';
  dropdown.style.left = rect.left + 'px';
  dropdown.style.zIndex = 1000;


  // Append dropdown to the document body
  document.body.appendChild(dropdown);

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
      dropdown.remove();
    }
  });
}

addEmailInputButton();

