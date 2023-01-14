<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { round, clamp } from "../helpers/math";
type CardProps = {
  name?: string;
  img?: string;
  number?: string;
  supertype?: string;
  subtypes?: string | Array<string>;
  rarity?: string;
  showcase?: boolean;
  gallery?: boolean;
};
const props = withDefaults(defineProps<CardProps>(), {
  name: "",
  img: "",
  number: "",
  supertype: "pokémon",
  subtypes: "basic",
  rarity: "common",
  gallery: false,
  showcase: false,
});
const filtered = computed(() => {
  let filtered = { ...props };
  filtered.subtypes = "";
  filtered.rarity = props.rarity.toLowerCase();
  filtered.supertype = props.supertype.toLowerCase();
  filtered.number = props.number.toLowerCase();
  filtered.gallery = props.number.startsWith("tg");
  if (Array.isArray(props.subtypes)) {
    filtered.subtypes = props.subtypes.join(" ").toLowerCase();
  }
  return filtered;
});
const backImage =
  "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg";
const baseImage = props.img.startsWith("http")
  ? ""
  : "https://images.pokemontcg.io/";
const frontImage = ref("");
setTimeout(() => {
  frontImage.value = baseImage + props.img;
}, 20);
const galaxyPosition = Math.floor(Math.random() * 1500);
const btnCardRef = ref<HTMLButtonElement | null>(null);
watch(btnCardRef, (cur: HTMLButtonElement | null) => {
  cur &&
    cur.addEventListener("pointermove", (e: PointerEvent) => {
      const elem = cur;
      const rect = elem.getBoundingClientRect();
      const absolute = {
        x: e.clientX - rect.left, // get mouse position from left
        y: e.clientY - rect.top, // get mouse position from right
      };
      const percent = {
        x: round((100 / rect.width) * absolute.x),
        y: round((100 / rect.height) * absolute.y),
      };
      const center = {
        x: percent.x - 50,
        y: percent.y - 50,
      };
      const springGlare = {
        x: 0,
        y: 0,
        o: 0,
      };
      const springBackground = {
        x: 0,
        y: 0,
      };
      springBackground.x = round(50 + percent.x / 4 - 12.5);
      springBackground.y = round(50 + percent.y / 3 - 16.67);
      const springRotate = {
        x: 0,
        y: 0,
      };
      springRotate.x = round(-(center.x / 3.5));
      springRotate.y = round(center.y / 2);
      springGlare.x = percent.x;
      springGlare.y = percent.y;
      springGlare.o = 1;
      elem.style.setProperty("--mx", `${springGlare.x}%`);
      elem.style.setProperty("--my", `${springGlare.y}%`);
      elem.style.setProperty("--o", `${springGlare.o}`);
      elem.style.setProperty("--rx", `${springRotate.x}deg`);
      elem.style.setProperty("--ry", `${springRotate.y}deg`);
      elem.style.setProperty(
        "--pos",
        `${springBackground.x}% ${springBackground.y}%`
      );
      elem.style.setProperty("--posx", `${springBackground.x}%`);
      elem.style.setProperty("--posy", `${springBackground.y}%`);
      elem.style.setProperty(
        "--hyp",
        `${clamp(
          Math.sqrt(
            (springGlare.y - 50) * (springGlare.y - 50) +
              (springGlare.x - 50) * (springGlare.x - 50)
          ) / 50,
          0,
          1
        )}`
      );
      elem.style.setProperty("--galaxybg", `center ${galaxyPosition}px`);
    });
});
</script>

<script lang="ts">
import "../assets/base.css";
import "../assets/main.css";
import MyShine from "./Shine.vue";
import MyGlare from "./Glare.vue";
export default {
  name: "my-card",
  components: { MyShine, MyGlare },
};
</script>

<template>
  <div
    class="card"
    :data-number="filtered.number"
    :data-subtypes="filtered.subtypes"
    :data-supertype="filtered.supertype"
    :data-rarity="filtered.rarity"
    :data-gallery="filtered.gallery"
  >
    <div class="card__translater">
      <button
        class="card__rotator"
        aria-label="Expand the Pokemon Card; {name}."
        ref="btnCardRef"
        tabindex="0"
      >
        <img
          class="card__back"
          :src="backImage"
          alt="The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
          loading="lazy"
          width="660"
          height="921"
        />
        <div class="card__front">
          <img
            :src="frontImage"
            :alt="`Front design of the ${name} Pokemon Card, with the stats and info around the edge`"
            loading="lazy"
            width="660"
            height="921"
          />
          <my-shine :subtypes="filtered.subtypes" :supertype="supertype" />
          <my-glare :subtypes="filtered.subtypes" :rarity="rarity" />
        </div>
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --mx: 50%;
  --my: 50%;
  --s: 1;
  --o: 1;
  --tx: 0px;
  --ty: 0px;
  --rx: 0deg;
  --ry: 0deg;
  --pos: 50% 50%;
  --posx: 50%;
  --posy: 50%;
  --hyp: 1;
}

.card {
  max-width: 500px;
  --radius: 4.55% / 3.5%;
  --back: #004177;
  --glow: #69d1e9;
  z-index: calc(var(--s) * 100);
  transform: translate3d(0, 0, 0.1px);
  -webkit-transform: translate3d(0, 0, 0.1px);
  will-change: transform, visibility;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

.card.interacting {
  z-index: calc(var(--s) * 120);
}

.card.active .card__translater,
.card.active .card__rotator {
  touch-action: none;
}

.card__translater,
.card__rotator {
  display: grid;
  perspective: 600px;
  transform-origin: center;
  -webkit-transform-origin: center;
  will-change: transform;
}

.card__translater {
  width: auto;
  position: relative;
  transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
  -webkit-transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
}

.card__rotator {
  transform: rotateY(var(--rx)) rotateX(var(--ry));
  transform-style: preserve-3d;
  -webkit-transform: rotateY(var(--rx)) rotateX(var(--ry));
  -webkit-transform-style: preserve-3d;
  box-shadow: 0px 10px 20px -5px black;
  border-radius: var(--radius);
  outline: none;
  transition: box-shadow 0.4s ease, outline 0.2s ease;
}
button.card__rotator {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  background: top;
  padding: 0;
}

.card.active .card__rotator {
  box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow),
    0 0 30px 0px var(--glow);
}

.card__rotator:focus {
  box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow),
    0 0 30px 0px var(--glow);
}

.card.active .card__rotator:focus {
  box-shadow: 0px 10px 30px 3px black;
}

.card__rotator * {
  width: 100%;
  display: grid;
  grid-area: 1/1;
  border-radius: var(--radius);
  image-rendering: optimizeQuality;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

.card__rotator img {
  outline: 1px solid transparent;
  aspect-ratio: 0.716;
  height: auto;
}

.card__back {
  background-color: var(--back);
  transform: rotateY(180deg) translateZ(1px);
  -webkit-transform: rotateY(180deg) translateZ(1px);
  backface-visibility: visible;
}

.card__front,
.card__front * {
  backface-visibility: hidden;
}

.card__front {
  opacity: 1;
  transition: opacity 0.33s ease-out;
}

.loading .card__front {
  opacity: 0;
}

.loading .card__back {
  transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
}
</style>
