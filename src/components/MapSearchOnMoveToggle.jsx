import { Card, Checkbox, message, Row, Switch } from "antd";
import { useEffect, useState } from "react/cjs/react.development";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { geoSearchSelectionAtom, mapBoundsAtom } from "../atoms/geofilterAtoms";
import { mapAtom } from "../atoms/mapAtoms";

export function MapSearchOnMoveToggle() {
  const MAP = useRecoilValue(mapAtom);
  const [MAPBOUNDS, SET_MAPBOUNDS] = useState(null);
  const [SEARCH_ON_MAPMOVE, SET_SEARCH_ON_MAPMOVE] = useState(true);
  const SET_SEARCH_SELECTION = useSetRecoilState(geoSearchSelectionAtom);

  useEffect(() => {
    if (!MAPBOUNDS) {
      SET_MAPBOUNDS(JSON.stringify(MAP.getBounds()));
      MAP.on("moveend", () => {
        SET_MAPBOUNDS(JSON.stringify(MAP.getBounds()));
      });
    }
  }, []);

  useEffect(() => {
    if (MAP && SEARCH_ON_MAPMOVE && MAPBOUNDS) {
      const b = JSON.parse(MAPBOUNDS);
      const newBbox = [
        b["_sw"]["lng"],
        b["_sw"]["lat"],
        b["_ne"]["lng"],
        b["_ne"]["lat"],
      ];
      message.info(`map bounds are now ${newBbox}`);

      /* SET_SEARCH_SELECTION({
          bbox: newBbox,
          properties: {
              display_name: "Custom search boundary"
          }
      }); */
    }
  }, [MAPBOUNDS]);
  return (
    <Card size="small" focusable={false}>
      <Row justify="space-between">
        <Checkbox
          checked={SEARCH_ON_MAPMOVE}
          onClick={() => SET_SEARCH_ON_MAPMOVE((prev) => !prev)}
        >
          <b>Search as I move the map</b>
        </Checkbox>
      </Row>
    </Card>
  );
}
