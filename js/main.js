// $(function () {

// })

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
	for (let index = 0; index < quantityButtons.length; index++) {
		const quantityButton = quantityButtons[index];
		quantityButton.addEventListener("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
			if (quantityButton.classList.contains('quantity__button_plus')) {
				value++;
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

//garanty-hidden

// const garantyChoises = document.querySelectorAll('.step-choise__product');
// garantyChoises.forEach((garantyChoise) => {
//    garantyChoise.addEventListener('click', function () {
//         const stepQuantity = this.closest.querySelectorAll('.step-quantity');
//         console.log(stepQuantity)
//         stepQuantity.forEach((el) => {
          
//             const checkbox = el.querySelector('.checkbox-product-input');
//             el.classList.remove('active');
//             if (checkbox && checkbox.checked) {
//                 el.classList.add('active');
//             }
//         });
//     });
// });

// let blocks = Object.values(document.querySelectorAll('.step-hidden'));
// let counter = 1

// let orderBillBtn = document.querySelector('.order-bill-btn')
// let stepTitle = document.querySelectorAll('.step__title')
// let stepCount = document.querySelectorAll('.step-count')
// let stepCheck = document.querySelectorAll('.step-check')

// const checkBlock = (block) => {
//   if (block.classList.contains('step-active')) {
//     block.style = 'display: block'
//   } else {
//     block.style = 'display: none'
//   }
// }

// const listener = (event) => {
//   const parent = event.target.closest('.step-hidden');
//   const inputs = Object.values(parent.querySelectorAll('input'));
//   const inputsValue = inputs.map((el) => {
//     if (el.type == 'text') {
//       return el.value
//     }
//     if (el.type == 'checkbox') {
//       return el.checked
//     }
//     if (el.type == 'radio') {
//       return true
//     }
//   })
//   if (inputsValue.every((el) => el)) {
//     parent.style = 'display: block'
//     console.log(counter)
//       if (counter < 5) {
//          blocks[counter].style = 'display: block';
//          blocks[counter - 1].classList.add('active');
//          counter++;
//       }
//    }
// }

// blocks.forEach((el) => checkBlock(el))
// blocks.forEach((el) => {
//   el.addEventListener('change', listener)
// })



// function stepActive() {
//    blocks.forEach((el) => {
//       if (el.contains.classList('active')) {
//          parent.closest.stepTitle.classList.add('active');
//          parent.closest.stepCount.classList.add('active');
//          parent.closest.stepCheck.classList.add('active');
//       } else {
//          parent.closest.stepTitle.classList.revome('active');
//          parent.closest.stepCount.classList.revome('active');
//          parent.closest.stepCheck.classList.revome('active');
//       }
//   });
// }

// stepActive();

// blocks.forEach((item) => {
//    if (item.classList.contains('active')) {
//       orderBillBtn.classList.remove('disabled');
//    } else {
//       orderBillBtn.classList.add('disabled')
//    }
// });


// const step1 = document.querySelector('.step1')
// const step2 = document.querySelector('.step2')
// console.log(step1)

// const blocks1 = step1.querySelectorAll('input').value
// console.log(blocks1)

// function listen1() {
//    if(blocks1.length > 0) {
//       step2.classList.add('active')
//    }
// }


// console.log(blocks1)


// blocks1.forEach((block1) =>{
//    blocks1.addEventListener('change', function(e){
//       if(block1.length >= 1){ 
//          step2.classList.add('active');
//       }
//    });
// };



// const blocks1 = document.querySelectorAll('input');
// blocks1.forEach((block1) =>{
//    block1.addEventListener('keyup', ()=> {
//       if(blocks1.length > 0) {
//          step2.classList.add('active')
//       } 
//    })
// });




// console.log(orderBillBtn)

// function checkBillBtn() {
//    if (blocks[4].style = 'display: block') {
//       orderBillBtn.classList.remove('disabled');
//    }
// }
// checkBillBtn();



