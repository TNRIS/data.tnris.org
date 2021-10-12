import { atom } from "recoil";

// url query as state
export const searchString = atom({
  key: "searchString",
  default: null,
  /* effects_UNSTABLE: [
    ({onSet}) => {
      onSet( (newValue, oldValue) => {
        console.log(newValue, "\n", oldValue);
      });
    },
  ], */
});


