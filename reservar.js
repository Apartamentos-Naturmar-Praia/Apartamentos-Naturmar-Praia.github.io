const isEN = document.URL.includes("/en/");
const peoplePerType = {
  "T0": 2, "T0+1": 3, "T0+2": 4, "T1": 4, "T1S": 4, "T1+1": 6, "T2": 6
};
const maxNumberOfType = {
  "T0": 1, "T0+1": 2, "T0+2": 1, "T1": 3, "T1S": 1, "T1+1": 2, "T2": 1
};
const resultTextH = document.getElementById("result-text");
const formPeopleH = document.getElementById("form-people");
const formTypesH = document.getElementById("form-types");
const formNumberH = document.getElementById("form-number");
const formCheckInH = document.getElementById("form-check-in");
const formCheckOutH = document.getElementById("form-check-out");
formCheckInH.min = formCheckOutH.min = new Date().toISOString().split("T")[0];
let message;

const genMessage = () => {
  const formNameH = document.getElementById("form-name");
  const formSurnameH = document.getElementById("form-surname");
  const formPhoneH = document.getElementById("form-phone");
  const formInfoH = document.getElementById("form-info");
  const resultH = document.getElementById("result");
  const contentH = document.getElementById("main-content");

  contentH.classList.replace("main-content-without-result", "main-content-with-result");
  message = isEN
    ? `Name: ${formNameH.value} ${formSurnameH.value};\nTelephone: ${formPhoneH.value};\nTypes: `
    : `Nome: ${formNameH.value} ${formSurnameH.value};\nTelefone: ${formPhoneH.value};\nTipologias: `;
  for (let i = 0; i < formNumberH.value; i++) {
    message += `${formTypesH.children[i].children[0].value},`;
  }
  message = (message += ";\n").replace(",;", ";");
  message += isEN
    ? `People: ${formPeopleH.value};\nCheck-in: ${formCheckInH.value};\nCheck-out: ${formCheckOutH.value};\n`
    : `Pessoas: ${formPeopleH.value};\nEntrada: ${formCheckInH.value};\nSaída: ${formCheckOutH.value};\n`;
  if (formInfoH.value !== "") {
    message += isEN ? `Information:\n${formInfoH.value}` : `Informações:\n${formInfoH.value}`;
  }
  resultTextH.innerHTML = message;
  resultTextH.rows = 7;
  resultH.hidden = false;
};
const formNumberChanged = () => {
  for (let i = 0; i < formTypesH.children.length; i++) {
    const item = formTypesH.children[i];
    const type = item.children[0];
    if (i < formNumberH.value) {
      item.hidden = type.disabled = false;
    } else {
      item.hidden = type.disabled = true;
      type[2].selected = true;
    }
  }
  formTypeChanged();
};
const formTypeChanged = () => {
  const typeCounts = {
    "T0": 0, "T0+1": 0, "T0+2": 0, "T1": 0, "T1S": 0, "T1+1": 0, "T2": 0
  };
  for (const item of formTypesH.children) {
    if (!item.hidden) {
      typeCounts[item.children[0].value]++;
    }
  }
  for (const item of formTypesH.children) {
    if (!item.hidden) {
      const type = item.children[0];
      for (const typeCount in typeCounts) {
        if (typeCounts[typeCount] === maxNumberOfType[typeCount]) {
          if (typeCount !== type.value) {
            for (const option of type) {
              if (option.value === typeCount) {
                option.hidden = option.disabled = true;
                break;
              }
            }
          }
        } else {
          for (const option of type) {
            if (option.value === typeCount) {
              option.hidden = option.disabled = false;
              break;
            }
          }
        }
      }
    }
  }

  let maxPeople = 0;
  for (const item of formTypesH.children) {
    if (!item.hidden) {
      maxPeople += peoplePerType[item.children[0].value];
    }
  }
  for (let i = 0; i < formPeopleH.length; i++) {
    if (i < maxPeople) {
      formPeopleH[i].disabled = formPeopleH[i].hidden = false;
    } else {
      formPeopleH[i].disabled = formPeopleH[i].hidden = true;
      if (formPeopleH[i].selected) {
        formPeopleH[0].selected = true;
      }
    }
  }
};
const changeFormDate = inDate => {
  if (inDate && formCheckOutH.value === "") {
    formCheckOutH.value = formCheckInH.value;
  } else if (!inDate && formCheckInH.value === "") {
    formCheckInH.value = formCheckOutH.value;
  }
  formCheckInH.max = formCheckOutH.value;
  formCheckOutH.min = formCheckInH.value;
};
const resetFormTypes = () => {
  formTypesH.children[0].hidden = formTypesH.children[0].children[0].disabled = false;
  formTypesH.children[1].hidden = formTypesH.children[1].children[0].disabled = true;
  formTypesH.children[2].hidden = formTypesH.children[2].children[0].disabled = true;
  for (const item of formTypesH.children) {
    const type = item.children[0];
    for (const option of type) {
      option.hidden = option.disabled = false;
    }
  }
  formTypesH.children[0].children[0].value = "T0";
  formTypesH.children[1].children[0].value = formTypesH.children[2].children[0].value = "T1";
  for (let i = 0; i < formPeopleH.length; i++) {
    formPeopleH[i].disabled = formPeopleH[i].hidden = i > 1;
  }
  formPeopleH.value = "1";
};
const copyMessage = () => {
  const note = document.getElementById("result-copy-button-note");
  resultTextH.select();
  resultTextH.setSelectionRange(0, 99999); // For mobile devices
  if(navigator.clipboard !== undefined && navigator.clipboard !== null) {
    navigator.clipboard.writeText(message);
    note.style.display = "block";
    setTimeout(() => note.style.display = "none", 1000);
  }
};
