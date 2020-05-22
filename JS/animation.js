const wrapperEl = document.querySelector('.wrapper');

const numberOfEls = 100;

function createEl(i) {
  let el = document.createElement('div');
  const rotate = (360 / numberOfEls) * i;
  const translateY = -50;
  const hue = Math.round(360 / numberOfEls * i);

  el.classList.add('el');
  el.id = "elm"+i;

  el.setAttribute("translateY", translateY);
  el.setAttribute("rotate", rotate);

  el.style.backgroundColor = 'hsl(' + hue + ', 40%, 60%)';
  el.style.transform = 'rotate(' + rotate + 'deg) translateY(' + translateY + '%) scale (0)';

  wrapperEl.appendChild(el);
};

for (let i = 0; i < numberOfEls; i++){
  createEl(i);
}
