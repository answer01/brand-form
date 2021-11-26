// select-head

let select = function () {
   let selectHeader = document.querySelectorAll('.select-head');
   let selectItem = document.querySelectorAll('.select-item');

   selectHeader.forEach(item => {
       item.addEventListener('click', selectToggle)
   });

   selectItem.forEach(item => {
       item.addEventListener('click', selectChoose)
   });

   function selectToggle() {
       this.parentElement.classList.toggle('active');
   }

   function selectChoose() {
       let text = this.innerText,
           select = this.closest('.header__select'),
           currentText = select.querySelector('.select-curent');
       currentText.innerText = text;
       select.classList.remove('active');
   }
};
select();

/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/
// SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
   // Получение обычных слойлеров
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
       return !item.dataset.spollers.split(',')[0];
   });
   // Инициализация обычных слойлеров
   if (spollersRegular.length > 0) {
       initSpollers(spollersRegular);
   }

   // Получение слойлеров с медиа запросами
   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
       return item.dataset.spollers.split(',')[0];
   });

   // Инициализация слойлеров с медиа запросами
   if (spollersMedia.length > 0) {
       const breakpointsArray = [];
       spollersMedia.forEach((item) => {
           const params = item.dataset.spollers;
           const breakpoint = {};
           const paramsArray = params.split(',');
           breakpoint.value = paramsArray[0];
           breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
           breakpoint.item = item;
           breakpointsArray.push(breakpoint);
       });

       // Получаем уникальные брейкпоинты
       let mediaQueries = breakpointsArray.map(function (item) {
           return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
       });
       mediaQueries = mediaQueries.filter(function (item, index, self) {
           return self.indexOf(item) === index;
       });

       // Работаем с каждым брейкпоинтом
       mediaQueries.forEach((breakpoint) => {
           const paramsArray = breakpoint.split(',');
           const mediaBreakpoint = paramsArray[1];
           const mediaType = paramsArray[2];
           const matchMedia = window.matchMedia(paramsArray[0]);

           // Объекты с нужными условиями
           const spollersArray = breakpointsArray.filter(function (item) {
               if (item.value === mediaBreakpoint && item.type === mediaType) {
                   return true;
               }
           });
           // Событие
           matchMedia.addListener(function () {
               initSpollers(spollersArray, matchMedia);
           });
           initSpollers(spollersArray, matchMedia);
       });
   }

   // Инициализация
   function initSpollers(spollersArray, matchMedia = false) {
       spollersArray.forEach((spollersBlock) => {
           spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
           if (matchMedia.matches || !matchMedia) {
               spollersBlock.classList.add('_init');
               initSpollerBody(spollersBlock);
               spollersBlock.addEventListener('click', setSpollerAction);
           } else {
               spollersBlock.classList.remove('_init');
               initSpollerBody(spollersBlock, false);
               spollersBlock.removeEventListener('click', setSpollerAction);
           }
       });
   }

   // Работа с контентом
   function initSpollerBody(spollersBlock, hideSpollerBody = true) {
       const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
       if (spollerTitles.length > 0) {
           spollerTitles.forEach((spollerTitle) => {
               if (hideSpollerBody) {
                   spollerTitle.removeAttribute('tabindex');
                   if (!spollerTitle.classList.contains('active')) {
                       spollerTitle.nextElementSibling.hidden = true;
                   }
               } else {
                   spollerTitle.setAttribute('tabindex', '-1');
                   spollerTitle.nextElementSibling.hidden = false;
               }
           });
       }
   }

   function setSpollerAction(e) {
       const el = e.target;
       if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
           const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
           const spollersBlock = spollerTitle.closest('[data-spollers]');
           const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
           if (!spollersBlock.querySelectorAll('._slide').length) {
               if (oneSpoller && !spollerTitle.classList.contains('active')) {
                   hideSpollersBody(spollersBlock);
               }
               spollerTitle.classList.toggle('active');
               _slideToggle(spollerTitle.nextElementSibling, 500);
           }
           e.preventDefault();
       }
   }

   function hideSpollersBody(spollersBlock) {
       const spollerActiveTitle = spollersBlock.querySelector('[data-spoller].active');
       if (spollerActiveTitle) {
           spollerActiveTitle.classList.remove('active');
           _slideUp(spollerActiveTitle.nextElementSibling, 500);
       }
   }
}

//SlideToggle
let _slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
       target.classList.add('_slide');
       target.style.transitionProperty = 'height, margin, padding';
       target.style.transitionDuration = duration + 'ms';
       target.style.height = target.offsetHeight + 'px';
       target.offsetHeight;
       target.style.overflow = 'hidden';
       target.style.height = 0;
       target.style.paddingTop = 0;
       target.style.paddingBottom = 0;
       target.style.marginTop = 0;
       target.style.marginBottom = 0;
       window.setTimeout(() => {
           target.hidden = true;
           target.style.removeProperty('height');
           target.style.removeProperty('padding-top');
           target.style.removeProperty('padding-bottom');
           target.style.removeProperty('margin-top');
           target.style.removeProperty('margin-bottom');
           target.style.removeProperty('overflow');
           target.style.removeProperty('transition-duration');
           target.style.removeProperty('transition-property');
           target.classList.remove('_slide');
       }, duration);
   }
};
let _slideDown = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
       target.classList.add('_slide');
       if (target.hidden) {
           target.hidden = false;
       }
       let height = target.offsetHeight;
       target.style.overflow = 'hidden';
       target.style.height = 0;
       target.style.paddingTop = 0;
       target.style.paddingBottom = 0;
       target.style.marginTop = 0;
       target.style.marginBottom = 0;
       target.offsetHeight;
       target.style.transitionProperty = 'height, margin, padding';
       target.style.transitionDuration = duration + 'ms';
       target.style.height = height + 'px';
       target.style.removeProperty('padding-top');
       target.style.removeProperty('padding-bottom');
       target.style.removeProperty('margin-top');
       target.style.removeProperty('margin-bottom');
       window.setTimeout(() => {
           target.style.removeProperty('height');
           target.style.removeProperty('overflow');
           target.style.removeProperty('transition-duration');
           target.style.removeProperty('transition-property');
           target.classList.remove('_slide');
       }, duration);
   }
};

let _slideToggle = (target, duration = 500) => {
   if (target.hidden) {
       return _slideDown(target, duration);
   } else {
       return _slideUp(target, duration);
   }
};

//QUANTITY
let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
   for (let index = 0; index < quantityButtons.length; index ++) {
       const quantityButton = quantityButtons[index];
       quantityButton.addEventListener("click", function (e) {
           let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
           if (quantityButton.classList.contains('quantity__button_plus')) {
               value ++;
           } else {
               value = value - 1;
               if (value < 1) {
                   value = 1
               }
           }
           quantityButton.closest('.quantity').querySelector('input').value = value;
       });
   }
}


//step-choise

const stepChoises = document.querySelectorAll('.step-choise__item');
stepChoises.forEach((choise) => {
   choise.addEventListener('click', function () {
       const choises = this.parentElement.querySelectorAll('.step-choise__item');

       choises.forEach((el) => {
           const checkbox = el.querySelector('.checkbox-input');
           el.classList.remove('active');
           if (checkbox && checkbox.checked) {
               el.classList.add('active');
           }
       });
   });
});

//Check-form

const stepCheckIcon = document.querySelectorAll(".step-check")
const stepHidden = document.querySelectorAll(".step-hidden")
stepHidden.forEach(el => el.style.display = "none")

//inputs step-one
const inName = document.querySelector(".step-input__name")
const inLastName = document.querySelector(".step-input__lastname")
const inPhone = document.querySelector(".step-input__phone")
const inMail = document.querySelector(".step-input__mail")
const checkboxOne = document.querySelector(".checkbox-input")

//inputs step-two

const checkDelivery = document.getElementById("form-delivery")
const inStreet = document.querySelector(".step-input__street")
const inHouse = document.querySelector(".step-input__house")
const inApartment = document.querySelector(".step-input__apartment")
const checkPickup = document.getElementById("form-pickup")

//inputs step-tree

const radioStep = document.querySelectorAll(".checkbox-input")


//inputs step-five
const disableBtn = document.getElementById("disable-button")
const stepCounter = document.querySelectorAll(".step-quantity");


const dataSteps = {
   stepOne: {
       name: '',
       lastName: '',
       phone: '',
       mail: '',
       checkbox: false
   },
   stepTwo: {
       checkDelivery: {
           checkbox: false,
           street: '',
           house: '',
           apartment: ''
       },
       checkPickup: false
   },
   stepTree : {
       radioValue : ''
   },
   stepFour : {
       radioValue : ''
   },
   stepFive : {
       radioValue : ''
   }

}


inName.addEventListener("keyup", (e) => {

   if (inName.value.length &&
       inLastName.value.length &&
       inPhone.value.length &&
       inMail.value.length &&
       checkboxOne.checked) {
       stepHidden[0].style.display = "block"
       stepCheckIcon[0].classList.add("active")
   } else {
       stepHidden[0].style.display = "none"
       stepCheckIcon[0].classList.remove("active")
   }
})
inLastName.addEventListener("keyup", (e) => {
   dataSteps.stepOne.lastName = e.target.value

   if (inName.value.length &&
       inLastName.value.length &&
       inPhone.value.length &&
       inMail.value.length &&
       checkboxOne.checked) {
       stepHidden[0].style.display = "block"
       stepCheckIcon[0].classList.add("active")

   } else {
       stepHidden[0].style.display = "none"
       stepCheckIcon[0].classList.remove("active")
   }
})
inPhone.addEventListener("keyup", (e) => {
   dataSteps.stepOne.phone = e.target.value

   if (inName.value.length &&
       inLastName.value.length &&
       inPhone.value.length &&
       inMail.value.length &&
       checkboxOne.checked) {
       stepHidden[0].style.display = "block"
       stepCheckIcon[0].classList.add("active")

   } else {
       stepHidden[0].style.display = "none"
       stepCheckIcon[0].classList.remove("active")
   }
})
inMail.addEventListener("keyup", (e) => {
   dataSteps.stepOne.mail = e.target.value

   if (inName.value.length &&
       inLastName.value.length &&
       inPhone.value.length &&
       inMail.value.length &&
       checkboxOne.checked) {
       stepHidden[0].style.display = "block"
       stepCheckIcon[0].classList.add("active")

   } else {
       stepHidden[0].style.display = "none"
       stepCheckIcon[0].classList.remove("active")
   }
})
checkboxOne.addEventListener("change", (e) => {
   dataSteps.stepOne.checkbox = e.target.checked

   if (inName.value.length &&
       inLastName.value.length &&
       inPhone.value.length &&
       inMail.value.length &&
       checkboxOne.checked) {
       stepHidden[0].style.display = "block"
       stepCheckIcon[0].classList.add("active")

   } else {
       stepHidden[0].style.display = "none"
       stepCheckIcon[0].classList.remove("active")
   }
})


function disabledInput() {
   inStreet.setAttribute("disabled", "disable")
   inApartment.setAttribute("disabled", "disable")
   inHouse.setAttribute("disabled", "disable")
}

disabledInput()

function enableInput() {
   inStreet.removeAttribute("disabled")
   inApartment.removeAttribute("disabled")
   inHouse.removeAttribute("disabled")
   if (!dataSteps.stepTwo.checkDelivery.street &&
       !dataSteps.stepTwo.checkDelivery.house &&
       !dataSteps.stepTwo.checkDelivery.apartment) {
       stepHidden[1].style.display = "none"
       stepCheckIcon[1].classList.remove("active")
   }
}

checkDelivery.addEventListener("change", (e) => {
   dataSteps.stepTwo.checkDelivery.checkbox = e.target.checked
   dataSteps.stepTwo.checkPickup = false
   enableInput()
})

checkPickup.addEventListener("click", (e) => {
   stepHidden[1].style.display = "block"
   stepCheckIcon[1].classList.add("active")
   dataSteps.stepTwo.checkPickup = e.target.checked
   dataSteps.stepTwo.checkDelivery.checkbox = false
   disabledInput()
})

inStreet.addEventListener("keyup", (e) => {
   dataSteps.stepTwo.checkDelivery.street = e.target.value

   if (dataSteps.stepTwo.checkDelivery.checkbox &&
       dataSteps.stepTwo.checkDelivery.street &&
       dataSteps.stepTwo.checkDelivery.house &&
       dataSteps.stepTwo.checkDelivery.apartment) {
       stepHidden[1].style.display = "block"
       stepCheckIcon[1].classList.add("active")

   } else {
       stepHidden[1].style.display = "none"
       stepCheckIcon[1].classList.remove("active")
   }
})
inHouse.addEventListener("keyup", (e) => {
   dataSteps.stepTwo.checkDelivery.house = e.target.value

   if (dataSteps.stepTwo.checkDelivery.checkbox &&
       dataSteps.stepTwo.checkDelivery.street &&
       dataSteps.stepTwo.checkDelivery.house &&
       dataSteps.stepTwo.checkDelivery.apartment) {
       stepHidden[1].style.display = "block"
       stepCheckIcon[1].classList.add("active")

   } else {
       stepHidden[1].style.display = "none"
       stepCheckIcon[1].classList.remove("active")
   }
})
inApartment.addEventListener("keyup", (e) => {
   dataSteps.stepTwo.checkDelivery.apartment = e.target.value
   console.log(dataSteps)

   if (dataSteps.stepTwo.checkDelivery.checkbox &&
       dataSteps.stepTwo.checkDelivery.street &&
       dataSteps.stepTwo.checkDelivery.house &&
       dataSteps.stepTwo.checkDelivery.apartment) {
       stepHidden[1].style.display = "block"
       stepCheckIcon[1].classList.add("active")

   } else {
       stepHidden[1].style.display = "none"
       stepCheckIcon[1].classList.remove("active")
   }
})

radioStep.forEach((el) => {
   if (el.attributes.name.nodeValue === "payment") {
       el.addEventListener("change", (e) => {
           dataSteps.stepTree.radioValue = e.target.value
           stepHidden[2].style.display = "block"
           stepCheckIcon[2].classList.add("active")
       })
   }
})

radioStep.forEach((el) => {
   if (el.attributes.name.nodeValue === "cureir") {
       el.addEventListener("change", (e) => {
           dataSteps.stepFour.radioValue = e.target.value
           stepHidden[3].style.display = "block"
           stepCheckIcon[3].classList.add("active")
       })
   }
})

const stepChoiseProduct = document.querySelectorAll(".step-choise__product")
const stepGuarantees = document.querySelectorAll(".step-choise__item--garanty")
const checkboxProduct = document.querySelectorAll(".checkbox-product-input")

function disableCheckboxProduct () {
   checkboxProduct.forEach(el => {
       el.setAttribute("disabled", "disabled")
   })
}
disableCheckboxProduct()

function enableCheckboxProduct () {
   checkboxProduct.forEach(el => {
       el.removeAttribute("disabled")
   })
}


stepGuarantees.forEach(el => {
   el.addEventListener("click", () => {
       if(el.classList[2] === "active"){
           enableCheckboxProduct()
       } else {
           disableCheckboxProduct()
       }
   })
})

stepGuarantees[0].addEventListener("change", (e) =>{
       stepCheckIcon[4].classList.remove("active")
       disableBtn.classList.add("disabled")
       disableBtn.setAttribute("disabled", "disabled")

   stepChoiseProduct.forEach(el => {
       if(el.classList[1] === "active") {
           stepCheckIcon[4].classList.add("active")
           disableBtn.classList.remove("disabled")
           disableBtn.removeAttribute("disabled")
       }
   })
})


stepChoiseProduct.forEach(el => {

   const checkboxProductList = el.childNodes[1].childNodes[1].childNodes[1]
   checkboxProductList.addEventListener("change", () => {
      if(checkboxProductList.checked){
          el.classList.add("active")
      } else {
          el.classList.remove("active")
      }
   })
})



stepGuarantees[1].addEventListener('change', (e) => {
   if(e.currentTarget.classList[2] === "active") {
       stepCheckIcon[4].classList.add("active")
       disableBtn.classList.remove("disabled")
       disableBtn.removeAttribute("disabled")
   }
})
