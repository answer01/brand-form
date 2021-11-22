$(function () {

})

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
    for (let index = 0; index < quantityButtons.length; index++) {
        const quantityButton = quantityButtons[index];
        quantityButton.addEventListener('click', function (e) {
            let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
            if (quantityButton.classList.contains('quantity__button_plus')) {
                value++;
            } else {
                value = value - 1;
                if (value < 1) {
                    value = 1;
                }
            }
            quantityButton.closest('.quantity').querySelector('input').value = value;
        });
    }
}

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


//form-steps

// const getBlocks = () => document.querySelectorAll('.step')
// let counter = 1
// const checkBlock = (block) => {
//   if (block.classList.contains('step-active')) {
//     block.style = 'visibility: visible'
//   } else {
//     block.style = 'visibility: hidden'
//   }
// }

// const getTnputs = (block) => {
//   return Object.values(block.querySelectorAll('input'))
// }

// const goNext = () => {
//   console.log(counter)
//   const blocks = getBlocks()
//   console.log(blocks)
//   blocks[counter].style = 'visibility: visible'

// }

// const goBack = () => {
//   const blocks = getBlocks()
//   blocks[counter].style = 'visibility: hidden'
// }

// const checkInputsValue = (block) => {
//   let res = false
//   const inputs = getTnputs(block)
//   inputs.forEach(input => {
//     input.addEventListener('change', function handler() {
//       const inputsValue = inputs.map((input) => {
//         if (input.type == 'text') {
//           return input.value
//         }
//         if (input.type == 'checkbox') {
//           return input.checked
//         }
//         if (input.type == 'radio') {
//           const parent = input.parentNode
//           const parentInputsValue = parent.querySelectorAll('input')
//           console.log(parentInputsValue)
//           const radiosValue = inputs.map(input => input.checked)
//           if (radiosValue.every(el => el == false)) {
//             return false
//           } else {
//             return true
//           }
//           return
//         }
//         if (res) {
//           goNext()
//           block.removeEventListener('change', handler)
//         }
//       })
//       res = inputsValue.every(val => val)
//       console.log(inputsValue, res)
//       if (res) {
//         goNext()
//         counter++
//         this.removeEventListener('change', handler)
//       }
//       return res
//     })
//   })
// }

// const main = () => {
  
// }

// getBlocks().forEach((el) => checkBlock(el))
// getBlocks().forEach((el) => checkInputsValue(el))


// step-choise

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