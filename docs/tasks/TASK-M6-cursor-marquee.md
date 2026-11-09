# TASK M6: cursor polish + marquee band (design moment f)

- Cursor: eases toward the pointer (lerp in a rAF loop that stops when it arrives), squeezes on
  press, accent-filled `VER` disc over product images, accent ring over links/buttons. Same
  conditions as T9 (fine pointer, hover, no reduced motion).
- Marquee (00 §C, Red and Green "giant marquee type", own implementation): a band repeating
  `SEJA BEM-VINDO AO SLOW MODE / DAS RUAS PARA O MUNDO /` in Archivo condensed, CSS
  `translateX` loop, paused on hover and by a `PAUSAR FAIXA` / `RODAR FAIXA` toggle (2.2.2).
  Copies are `aria-hidden`; one visually hidden copy is read. Reduced motion: still, no toggle.
- Test: e2e toggle pauses (`animation-play-state`), reduced motion has no animation.
